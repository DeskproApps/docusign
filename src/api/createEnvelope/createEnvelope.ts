import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "../baseRequest";
interface Signer {
    name: string
    email: string
    fullName: string
    recipientId: string
    routingOrder?: string
}

export interface CreateEnvelopePayload {
    emailSubject: string
    emailBlurb?: string
    status: "sent" | "created"
    documents?: {
        name: string
        documentBase64: string
        fileExtension: string
        documentId: string
    }[]
    recipients: {
        signers: Signer[]
        carbonCopies?: Signer[]
    }
}

export default async function createEnvelope(client: IDeskproClient, payload: Readonly<CreateEnvelopePayload>): Promise<void> {

    await baseRequest(client, { endpoint: "envelopes", method: "POST", data: payload })

    return
}