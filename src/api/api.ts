import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";
import { RequestMethod } from "./types";
import { ACCESS_TOKEN, ACCOUNT_ID, REFRESH_TOKEN } from "../utils/consts";

export const getContactById = (
  client: IDeskproClient,
  contactId: string
): Promise<any> => {
  return installedRequest(
    client,
    `restapi/v2.1/accounts/${ACCOUNT_ID}/contacts/${contactId}`,
    "GET"
  );
};

export const getContactsByQuery = (
  client: IDeskproClient,
  query: string
): Promise<any> => {
  return installedRequest(
    client,
    `restapi/v2/accounts/${ACCOUNT_ID}/contacts?search_text=${query}`,
    "GET"
  );
};

export const getContacts = (client: IDeskproClient): Promise<any> => {
  return installedRequest(
    client,
    `restapi/v2.1/accounts/${ACCOUNT_ID}/users`,
    "GET"
  );
};

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
