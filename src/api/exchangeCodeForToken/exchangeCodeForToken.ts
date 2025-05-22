import { IDeskproClient, OAuth2Result, proxyFetch } from "@deskpro/app-sdk";

interface TokenRequestPayload {
    code: string
    redirect_uri: string
}

export default async function exchangeCodeForToken(client: IDeskproClient, params: TokenRequestPayload) {
    const dpFetch = await proxyFetch(client)

    const payload = new URLSearchParams({
        grant_type: "authorization_code",
        code: params.code,
        client_id: "__integration_key__",
        client_secret: "__secret_key__",
        redirect_uri: params.redirect_uri,
    })

    // Handle SANDBOX vs PRODUCTION
    const fetchURL = "https://account-d.docusign.com/oauth/token"

    const response = await dpFetch(fetchURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(payload).toString()
    })

    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json() as OAuth2Result["data"]
}