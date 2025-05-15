import { BaseDocusignPaginatedResponse } from "@/types/docusign"
import { baseRequest } from "@/api/baseRequest"
import { createSearchParams } from "react-router-dom"
import { IDeskproClient } from "@deskpro/app-sdk"
import { IEnvelopeFromList, IEnvelopeWithRecipients } from "@/api/types"

interface EnvelopesFetchResponse extends BaseDocusignPaginatedResponse {
    envelopes?: IEnvelopeFromList[]
}

interface RecipientsFetchResponse {
    signers: {
        firstName: string
        lastName: string
        name: string
        recipientId: string
        email: string
    }[]
}

export default async function getEnvelopeListByEmail(client: IDeskproClient, userEmail: string): Promise<IEnvelopeWithRecipients | null> {
    const resultCutDate = "2000-01-01"
    const maximumNumberOfEnvelopes = "1000"

    resultCutDate.toLowerCase()

    // Get envelopes associated with the provided user's email
    const envelopeSearchResponse = await baseRequest<EnvelopesFetchResponse>(
        client,
        {
            endpoint: `envelopes?${createSearchParams([
                ["from_date", resultCutDate],
                ["search_text", userEmail],
                ["count", maximumNumberOfEnvelopes],
            ]).toString()}`, method: "GET"
        }
    )

    const foundEnvelopes = envelopeSearchResponse.envelopes
    if (!foundEnvelopes?.length) {
        return null
    }

    // Get the recipients for each envelope 
    const envelopesWithRecipients = (await Promise.all(
        foundEnvelopes.map(async (envelope) => {
            const recipients = await baseRequest<RecipientsFetchResponse>(
                client,
                { endpoint: `envelopes/${envelope.envelopeId}/recipients`, method: "GET" }
            )

            return {
                envelopeId: envelope.envelopeId,
                recipients: recipients.signers.map(
                    (signer) => ({
                        email: signer.email,
                        name: signer.name,
                    })
                ),
            };
        })
    ))

    // Group recipients by email and collect all envelope ids they appear in
    const groupedRecipients = envelopesWithRecipients.reduce(
        (
            acc: {
                email: string;
                name: string;
                envelopeIds: string[];
            }[],
            envelope
        ) => {
            envelope.recipients.forEach((recipient) => {
                const existingEmail = acc.find((e) => e.email === recipient.email);

                if (!existingEmail) {
                    acc.push({
                        email: recipient.email,
                        name: recipient.name,
                        envelopeIds: [envelope.envelopeId],
                    });
                } else {
                    existingEmail.envelopeIds.push(envelope.envelopeId);
                }
            });

            return acc;
        },
        []
    )

    return groupedRecipients[0] ?? null
}