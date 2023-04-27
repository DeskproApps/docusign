import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";
import {
  IEnvelope,
  IEnvelopeFromList,
  IEnvelopeWithRecipients,
  RequestMethod,
} from "./types";
import {
  ACCESS_TOKEN,
  ACCOUNT_ID,
  DAY_MS,
  REFRESH_TOKEN,
} from "../utils/consts";
import { addToState, encodeHex, getFormattedDate } from "../utils/utils";

export const getEnvelopesWithRecipients = async (
  client: IDeskproClient,
  userEmail: string
): Promise<IEnvelopeWithRecipients | null> => {
  const dateState = (await client.getState("lastFetchDate"))[0]?.data as string;

  //check if a day has passed
  let date =
    new Date().getTime() - new Date(dateState || "2000-01-01").getTime() >
    DAY_MS
      ? getFormattedDate(new Date(new Date().getTime() - DAY_MS))
      : dateState;

  date = "2000-01-01";

  const envelopes = await installedRequest(
    client,
    `restapi/v2.1/accounts/${ACCOUNT_ID}/envelopes?from_date=${date}`,
    "GET"
  );

  await client.setState("lastFetchDate", getFormattedDate(new Date()));

  if (!envelopes.envelopes?.length) {
    return (
      ((await client.getState(`emailsWithIds/${encodeHex(userEmail)}`))?.[0]
        ?.data as IEnvelopeWithRecipients) || null
    );
  }

  const envelopesWithRecipients = (await Promise.all(
    (envelopes.envelopes as IEnvelopeFromList[]).map(async (envelope) => {
      const recipients = await installedRequest(
        client,
        `restapi/v2.1/accounts/${ACCOUNT_ID}/envelopes/${envelope.envelopeId}/recipients`,
        "GET"
      );

      return {
        envelopeId: envelope.envelopeId,
        recipients: recipients.signers.map(
          (signer: { email: string; name: string }) => ({
            email: signer.email,
            name: signer.name,
          })
        ),
      };
    })
  )) as { envelopeId: string; recipients: { email: string; name: string }[] }[];

  const emailArr = envelopesWithRecipients.reduce(
    (
      acc: {
        email: string;
        name: string;
        envelopeIds: string[];
      }[],
      envelope
    ) => {
      envelope.recipients.forEach((recipient) => {
        const foundEmail = acc.find((e) => e.email === recipient.email);

        if (!foundEmail) {
          acc.push({
            email: recipient.email,
            name: recipient.name,
            envelopeIds: [envelope.envelopeId],
          });
        } else {
          foundEmail.envelopeIds.push(envelope.envelopeId);
        }
      });

      return acc;
    },
    []
  ) as IEnvelopeWithRecipients[];

  await Promise.all(
    emailArr.map(
      async (data) => await addToState(client, data, date === "2000-01-01")
    )
  );

  return emailArr.find((e) => e.email === userEmail) ?? null;
};

export const getEnvelopeById = (
  client: IDeskproClient,
  envelopeId: string
): Promise<IEnvelope> => {
  return installedRequest(
    client,
    `restapi/v2.1/accounts/${ACCOUNT_ID}/envelopes/${envelopeId}`,
    "GET"
  );
};

export const getRecipients = (client: IDeskproClient) =>
  client.getState("emailsWithIds/*");

const installedRequest = async (
  client: IDeskproClient,
  url: string,
  method: RequestMethod,
  data?: unknown
) => {
  const fetch = await proxyFetch(client);

  const options: RequestInit = {
    method,
    headers: {
      Authorization: ACCESS_TOKEN,
      "X-Proxy-Origin": "",
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  let response = await fetch(
    `https://demo.docusign.net/${url.trim()}`,
    options
  );

  if ([400, 401, 403, 404].includes(response.status)) {
    let tokens;
    const refreshRequestOptions: RequestInit = {
      method: "POST",
      body: `grant_type=refresh_token&refresh_token=${REFRESH_TOKEN}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic __integration_key+':'+secret_key.base64__`,
        "X-Proxy-Origin": "",
      },
    };

    const refreshRes = await fetch(
      `https://account-d.docusign.com/oauth/token`,
      refreshRequestOptions
    );

    if (refreshRes.status !== 200) {
      refreshRequestOptions.body = `grant_type=refresh_token&refresh_token=__global_access_token.json("[refresh_token]")__`;

      const secondRefreshRes = await fetch(
        `https://account-d.docusign.com/oauth/token`,
        refreshRequestOptions
      );

      const secondRefreshData = await secondRefreshRes.json();

      if (secondRefreshRes.status !== 200) {
        throw new Error(
          JSON.stringify({
            status: secondRefreshRes.status,
            message: secondRefreshData,
          })
        );
      }

      tokens = secondRefreshData;
    } else {
      tokens = await refreshRes.json();
    }

    await client.setState<string>(
      "oauth/global/access_token",
      tokens.access_token,
      {
        backend: true,
      }
    );

    await client.setState<string>(
      "oauth/global/refresh_token",
      tokens.refresh_token,
      {
        backend: true,
      }
    );

    options.headers = {
      ...options.headers,
      Authorization: ACCESS_TOKEN,
      "X-Proxy-Origin": "",
    };

    response = await fetch(`https://demo.docusign.net/${url.trim()}`, options);
  }

  if (isResponseError(response)) {
    throw new Error(
      JSON.stringify({
        status: response.status,
        message: await response.text(),
      })
    );
  }

  return response.json();
};

export const isResponseError = (response: Response) =>
  response.status < 200 || response.status >= 400;
