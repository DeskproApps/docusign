// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { v4 as uuidv4 } from "uuid";
import { useEffect, useMemo, useState } from "react";
import {
  useDeskproAppClient,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";

import { ISettings } from "@/types/settings";
import { getEnvelopes, getUserInfo, login } from "@/api/preInstallApi";
import { Account, IAuth } from "@/types/docusign/general";

export const useGlobalAuth = () => {
  const { client } = useDeskproAppClient();
  const key = useMemo(() => uuidv4(), []);

  const [callbackUrl, setCallbackUrl] = useState<string | null>(null);
  const [authUrl, setAuthUrl] = useState<string | null>(null);

  const [poll, setPoll] = useState<(() => Promise<{ token: string }>) | null>(
    null
  );
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [oauth2Tokens, setOauth2Tokens] = useState<IAuth | null>(null);
  const [settings, setSettings] = useState<ISettings | null>(null);
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    error?: string;
    success?: string;
  } | null>(null);
  const [reviewed, setReviewed] = useState<boolean | null>(null);

  useDeskproAppEvents(
    {
      onAdminSettingsChange: setSettings,
    },
    []
  );

  useInitialisedDeskproAppClient(
    (client) => {
      (async () => {
        const { callbackUrl, poll } = await client
          .oauth2()
          .getAdminGenericCallbackUrl(
            key,
            /\?(code)=(?<token>[^&]+)/,
            // eslint-disable-next-line no-useless-escape
            /(&state)=(?<key>[^&]+)/
          );

        setCallbackUrl(callbackUrl);

        setPoll(() => poll);
      })();
    },
    [key]
  );

  useEffect(() => {
    if (!key || !callbackUrl) return;

    setAuthUrl(
      `https://account-d.docusign.com/oauth/auth?response_type=code&client_id=${
        settings?.integration_key
      }&redirect_uri=${callbackUrl}&scope=${encodeURIComponent(
        "extended signature openid click.manage click.send user_read account_read user_write organization_read domain_read"
      )}&state=${key}`
    );
  }, [settings?.integration_key, callbackUrl, key]);

  const signOut = () => {
    client?.setAdminSetting("");

    setAccessCode(null);
  };

  const signIn = async () => {
    if (!callbackUrl || !poll) {
      setMessage({
        error:
          "Error getting callback URL. Please wait for the app to be initialized.",
      });

      return;
    }

    const code = await poll()
      .then((e) => e.token)
      .catch(() => false);

    if (!code) {
      setMessage({
        error: "Error getting access code. Please try again.",
      });

      return;
    }

    setAccessCode(code as string);
  };

  useInitialisedDeskproAppClient(
    (client) => {
      if (![accessCode, callbackUrl].every((e) => e)) return;

      (async () => {
        const tokens: IAuth = await login(
          client,
          settings as ISettings,
          accessCode as string
        );

        if (tokens.error) {
          setMessage({
            error: "Error signing in. Please try again: " + tokens.error,
          });

          return;
        }

        setOauth2Tokens(tokens);
      })();
    },
    [accessCode, callbackUrl]
  );

  useEffect(() => {
    if (!client || !oauth2Tokens) return;

    (async () => {
      const user = await getUserInfo(client, oauth2Tokens.access_token);

      setMessage({
        success: `Successfully signed in. Welcome ${user.name}! Has your app been reviewed?`,
      });
    })();
  }, [client, oauth2Tokens]);

  useEffect(() => {
    if (!client || !selectedAccount || !oauth2Tokens) return;

    client.setAdminSetting(
      JSON.stringify({ ...oauth2Tokens, account_id: selectedAccount })
    );
  });

  useEffect(() => {
    if (!client || !oauth2Tokens || reviewed != false) return;

    new Array(20).fill(0).forEach((_) => {
      getEnvelopes(client, oauth2Tokens.access_token);
    });
  }, [client, oauth2Tokens, reviewed]);

  useEffect(() => {
    if (!client || !oauth2Tokens || !reviewed) return;

    (async () => {
      const user = await getUserInfo(client, oauth2Tokens.access_token);

      setAccounts(user.accounts);
    })();
  }, [client, oauth2Tokens, reviewed]);

  return {
    callbackUrl,
    poll,
    key,
    setAccessCode,
    signIn,
    signOut,
    message,
    authUrl,
    oauth2Tokens,
    accounts,
    selectedAccount,
    setSelectedAccount,
    setReviewed,
    reviewed,
  };
};
