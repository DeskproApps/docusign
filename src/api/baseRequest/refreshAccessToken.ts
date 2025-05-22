import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";

export default async function refreshAccessToken(client: IDeskproClient) {
    const dpFetch = await proxyFetch(client)
    const body = `grant_type=refresh_token&refresh_token=[[oauth/global/refresh_token]]`

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
    
    if (!response.ok) {
        throw new Error(`Error refreshing access token`)
    }
    const data = await response.json()

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