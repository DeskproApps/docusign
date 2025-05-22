import { ACCESS_TOKEN_PATH } from "@/constants/auth";
import { IUserInfo } from "@/types/docusign/general";
import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";

export default async function getAuthenticatedUser(client: IDeskproClient): Promise<IUserInfo | null> {
    const dpFetch = await proxyFetch(client)

    const response = await dpFetch("https://account-d.docusign.com/oauth/userinfo", {
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