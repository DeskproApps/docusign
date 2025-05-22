import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "../baseRequest";
import { createSearchParams } from "react-router-dom";
import { IEnvelopeFromList } from "../types";
import { DocusignUser } from "@/types/docusign/general";

export const SEARCH_QUERY_MIN_LENGTH = 4 as const
export default async function getUsersByQuery(client: IDeskproClient, searchQuery: string): Promise<DocusignUser[]> {
    const isValidSearchLength = searchQuery.length >= SEARCH_QUERY_MIN_LENGTH
    if (!isValidSearchLength) {
        return []
    }
    const resultCutDate = "2000-01-01"
    const maximumNumberOfEnvelopes = "1000"

    // Fetch the authenticated user's envelopes (max 1000) matching the search query.
    const response = await baseRequest<{ envelopes: IEnvelopeFromList[] }>(client, {
        endpoint: `envelopes?${createSearchParams([
            ["from_date", resultCutDate],
            ["search_text", searchQuery],
            ["include", "recipients"],
            ["count", maximumNumberOfEnvelopes],
        ]).toString()}`, method: "GET"
    })

    const envelopes = response.envelopes

    if(!envelopes){
        return []
    }

    const uniqueUsersMap = new Map<string, DocusignUser>()

    // Combine recipients (signers & carbon copies) from all
    // envelopes into one list.

    // KNOWN POTENTIAL ISSUE: If a user/recipient appears in
    // multiple envelopes with different names, only the first
    // encountered name is used.
    for (const envelope of envelopes) {
        const recipients = envelope.recipients ?? {}
        const combinedRecipients = [...(recipients.signers ?? []), ...(recipients.carbonCopies ?? [])]

        for (const recipient of combinedRecipients) {
            // Add user to the map if not already present.
            if (!uniqueUsersMap.has(recipient.userId)) {
                uniqueUsersMap.set(recipient.userId, {
                    userId: recipient.userId,
                    name: recipient.name,
                    email: recipient.email,
                })
            }
        }
    }

    return Array.from(uniqueUsersMap.values())
}