import { DocusignUser } from "@/types/docusign/general";
import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "../baseRequest";

export interface DocusignUserListResponse {
    users?: DocusignUser[]
    resultSetSize: string
    totalSetSize: string
    startPosition: string
    endPosition: string
}

/**
 * Fetches the list of DocuSign **account users** (users who have access to the Docusign account).
 * 
 * **NOTE:** This function does **NOT** return recipients or signers of envelopes.
 * 
 * @param client - The Deskpro API client instance.
 */
export default async function getAccountUsers(client: IDeskproClient) {
    return await baseRequest<DocusignUserListResponse>(client, { endpoint: "users", method: "GET" })
}