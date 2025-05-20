import { CreateEnvelopeFormMeta } from "@/pages/envelopes/create/schema";
import { CreateEnvelopePayload } from "@/api/createEnvelope";
import { v4 as uuidv4 } from "uuid";

export default function buildCreateEnvelopePayload(data: CreateEnvelopeFormMeta): CreateEnvelopePayload {
    const payload: CreateEnvelopePayload = {
        emailSubject: data.emailSubject,
        emailBlurb: data.emailBlurb,
        status: "sent",
        documents: data.documents.filter((document) => document !== undefined),
        recipients: {
            signers: data.recipients.signers.map((signer) => {
                return {
                    name: signer.name,
                    email: signer.email,
                    fullName: signer.name,
                    recipientId: uuidv4()
                }
            }),
            carbonCopies: data.recipients.carbonCopies?.map((carbonCopy) => {
                return {
                    name: carbonCopy.name,
                    email: carbonCopy.email,
                    fullName: carbonCopy.name,
                    recipientId: uuidv4()
                }
            })
        }
    }
    return payload
}