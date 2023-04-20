import { IDeskproClient, adminGenericProxyFetch } from "@deskpro/app-sdk";
import { ISettings } from "../types/settings";
import { IUserInfo } from "../types/docusign";
import base64 from "base64-min";

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
