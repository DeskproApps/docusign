import {
  Button,
  CopyToClipboardInput,
  H1,
  H2,
  P1,
  P5,
  Radio,
  Stack,
  useDeskproAppTheme,
} from "@deskpro/app-sdk";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useGlobalAuth } from "../../hooks/useGlobalAuth";

export const GlobalAuth = () => {
  const { theme } = useDeskproAppTheme();
  useEffect(() => {
    document.body.style.margin = "0px";
  }, []);

  const {
    callbackUrl,
    signIn,
    message,
    authUrl,
    accounts,
    setSelectedAccount,
    selectedAccount,
    setReviewed,
    reviewed,
  } = useGlobalAuth();

  return (
    <Stack vertical gap={10} style={{ height: "1000px" }}>
      {callbackUrl && (
        <>
          <H2 style={{ marginBottom: "5px" }}>Callback URL</H2>
          <CopyToClipboardInput value={callbackUrl}></CopyToClipboardInput>
          <P1
            style={{
              marginBottom: "16px",
              marginTop: "8px",
              color: theme.colors.grey80,
            }}
          >
            The callback URL will be required during the DocuSign app setup
          </P1>
        </>
      )}
      {authUrl && !message?.success && (
        <Link to={authUrl} target="_blank">
          <Button
            text="Sign In"
            data-testid="submit-button"
            onClick={signIn}
          ></Button>
        </Link>
      )}
      {!message ? (
        <div></div>
      ) : message.error ? (
        <H1 style={{ color: theme?.colors?.red100 }}>{message.error}</H1>
      ) : (
        <H1>{message.success}</H1>
      )}
      {message?.success && (
        <Stack gap={5}>
          <Button
            text="Reviewed"
            intent="secondary"
            onClick={() => setReviewed(true)}
          ></Button>
          <Button
            text="Not reviewed"
            intent="secondary"
            onClick={() => setReviewed(false)}
          ></Button>
        </Stack>
      )}
      {reviewed == false && (
        <P5>
          20 requests have been made. Please come back once the app has been
          reviewed and a production account has been added
        </P5>
      )}
      {!!reviewed && accounts && !selectedAccount && (
        <Stack vertical>
          <H1>Please select the account you'd like to use:</H1>
          <Stack vertical style={{ marginTop: "10px" }} gap={10}>
            {!selectedAccount && (
              <Stack vertical gap={10}>
                {accounts.map((account, i) => (
                  <Stack gap={5} key={i}>
                    <Radio
                      style={{
                        color: theme.colors.grey500,
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                      checked={selectedAccount === account.account_id}
                      onChange={() => setSelectedAccount(account.account_id)}
                    />
                    <H1>{account.account_name}</H1>
                  </Stack>
                ))}
              </Stack>
            )}
          </Stack>
        </Stack>
      )}
      <H1>
        {selectedAccount &&
          `Selected ${
            accounts?.find((e) => e.account_id === selectedAccount)
              ?.account_name
          }.`}
      </H1>
    </Stack>
  );
};
