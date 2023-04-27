import { IDeskproClient, adminGenericProxyFetch } from "@deskpro/app-sdk";
import { ISettings } from "../types/settings";
import { IUserInfo } from "../types/docusign";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore no types
import base64 from "base64-min";
import { getFormattedDate } from "../utils/utils";

export const getEnvelopes = async (client: IDeskproClient, token: string) => {
  const fetch = await adminGenericProxyFetch(client);

  const user = await getUserInfo(client, token);

  return fetch(
    `https://demo.docusign.net/restapi/v2.1/accounts/${
      user.accounts[0].account_id
    }/envelopes?from_date=${getFormattedDate(new Date())}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Proxy-Origin": "",
      },
    }
  ).then((res) => res.json());
};

export const login = async (
  client: IDeskproClient,
  secrets: ISettings,
  code: string
) => {
  const fetch = await adminGenericProxyFetch(client);

  return await fetch(
    `https://account-d.docusign.com/oauth/token?grant_type=authorization_code&code=${code}`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${base64.encode(
          `${secrets.integration_key}:${secrets.secret_key}`
        )}`,
      },
    }
  ).then((res) => res.json());
};

export const getUserInfo = async (
  client: IDeskproClient,
  token: string
): Promise<IUserInfo> => {
  const fetch = await adminGenericProxyFetch(client);

  return await fetch(`https://account-d.docusign.com/oauth/userinfo`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
};
