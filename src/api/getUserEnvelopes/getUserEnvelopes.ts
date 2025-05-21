import { BaseDocusignPaginatedResponse } from "@/types/docusign"
import { baseRequest } from "@/api/baseRequest"
import { createSearchParams } from "react-router-dom"
import { IDeskproClient } from "@deskpro/app-sdk"
import { IEnvelopeFromList } from "@/api/types"

interface EnvelopesFetchResponse extends BaseDocusignPaginatedResponse {
    envelopes?: IEnvelopeFromList[]
}

export default async function getUserEnvelopes(client: IDeskproClient, userEmail: string): Promise<IEnvelopeFromList[]> {
    const QUERY_START_DATE = "2000-01-01"
    const MAX_ENVELOPES_PER_REQUEST = "1000"

    // Get envelopes associated with the provided user's email
    const envelopeSearchResponse = await baseRequest<EnvelopesFetchResponse>(
        client,
        {
            endpoint: `envelopes?${createSearchParams([
                ["from_date", QUERY_START_DATE],
                ["search_text", userEmail],
                ["include", "recipients"],
                ["count", MAX_ENVELOPES_PER_REQUEST],
            ]).toString()}`, method: "GET"
        }
    )

    const envelopes = envelopeSearchResponse.envelopes
    if (!envelopes?.length) {
        return []
    }

    return envelopes
}