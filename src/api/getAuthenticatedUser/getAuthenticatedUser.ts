import { ACCESS_TOKEN_PATH } from "@/constants/auth";
import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";
import { IUserInfo } from "@/types/docusign/general";
import resolveSubdomain from "@/utils/resolveSubdomain";

export default async function getAuthenticatedUser(client: IDeskproClient, isSandboxAccount: boolean): Promise<IUserInfo | null> {
    const dpFetch = await proxyFetch(client)

    const subdomain = resolveSubdomain("account", isSandboxAccount)
    const response = await dpFetch(`https://${subdomain}.docusign.com/oauth/userinfo`, {
        method: "GET",
        headers: {
            Authorization: `Bearer [user[${ACCESS_TOKEN_PATH}]]`,
            "Content-Type": "application/json",
        }
    }

)

    if (!response.ok) {
        throw new Error(`Error fetching user info.`)
    }

    return await response.json() as IUserInfo
}