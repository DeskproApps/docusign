import { ACCESS_TOKEN_PATH, REFRESH_TOKEN_PATH } from "@/constants/auth";
import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";
import resolveSubdomain from "@/utils/resolveSubdomain";

export default async function refreshAccessToken(client: IDeskproClient, isSandboxAccount: boolean) {
    const dpFetch = await proxyFetch(client)
    const body = `grant_type=refresh_token&refresh_token=[user[${REFRESH_TOKEN_PATH}]]`

    const refreshRequestOptions: RequestInit = {
        method: "POST",
        body: body,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic __integration_key+':'+secret_key.base64__`,
        },
    }
    const subdomain = resolveSubdomain("account", isSandboxAccount)
    const response = await dpFetch(`https://${subdomain}.docusign.com/oauth/token`, refreshRequestOptions)

    if (!response.ok) {
        throw new Error(`Error refreshing access token`)
    }

    const data = await response.json()

    await client.setState<string>(
        ACCESS_TOKEN_PATH,
        data.access_token,
        {
            backend: true,
        }
    )

    await client.setState<string>(
        REFRESH_TOKEN_PATH,
        data.refresh_token,
        {
            backend: true,
        }
    )
}