import { baseRequest } from "../baseRequest";
import { DocusignUser } from "@/types/docusign/general";
import { IDeskproClient } from "@deskpro/app-sdk";

export interface DocusignUserListResponse {
    users?: DocusignUser[]
    resultSetSize: string
    totalSetSize: string
    startPosition: string
    endPosition: string
}

/**
 * Fetches the list of Docusign **account users** (users who have access to the Docusign account).
 * 
 * **NOTE:** This function does **NOT** return recipients or signers of envelopes.
 */
export default async function getAccountUsers(client: IDeskproClient): Promise<DocusignUserListResponse> {
    return await baseRequest<DocusignUserListResponse>(client, { endpoint: "users", method: "GET" })
}