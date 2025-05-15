import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";
import { REFRESH_TOKEN } from "@/utils/consts";

export default async function refreshAccessToken(client: IDeskproClient) {
    const dpFetch = await proxyFetch(client)

    const body = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: REFRESH_TOKEN,
    }).toString()

    const refreshRequestOptions: RequestInit = {
        method: "POST",
        body: body,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic __integration_key+':'+secret_key.base64__`,
            "X-Proxy-Origin": "",
        },
    }

    const response = await dpFetch("https://account-d.docusign.com/oauth/token", refreshRequestOptions)
    const data = await response.json()

    if (!response.ok) {
        throw new Error(`Error refreshing access token`)
    }

    await client.setState<string>(
        "oauth/global/access_token",
        data.access_token,
        {
            backend: true,
        }
    )

    await client.setState<string>(
        "oauth/global/refresh_token",
        data.refresh_token,
        {
            backend: true,
        }
    )
}