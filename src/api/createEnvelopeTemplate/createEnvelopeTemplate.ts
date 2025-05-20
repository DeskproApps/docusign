import { IDeskproClient } from "@deskpro/app-sdk";
import { baseRequest } from "../baseRequest";

interface Recipient {
    name: string
    email: string
    recipientId: string
    routingOrder?: string
    roleName?: string
    emailMessage?: string
}

interface CompositeTemplate {
    compositeTemplateId?: string
    serverTemplates?: Array<{
        sequence: string
        templateId: string
    }>;
    inlineTemplates?: Array<{
        sequence: string
        recipients: {
            signers?: Recipient[]
            carbonCopies?: Recipient[]
        }
    }>
    document?: {
        documentBase64: string
        name: string
        fileExtension: string
        documentId: string
    }
}
export interface CreateEnvelopeTemplatePayload {
    emailSubject: string
    status: "sent" | "created"
    compositeTemplates: CompositeTemplate[]
}

export default async function createEnvelopeTemplate(client: IDeskproClient, payload: Readonly<CreateEnvelopeTemplatePayload>): Promise<void> {
    await baseRequest(client, { endpoint: "envelopes", method: "POST", data: payload })

    return
}