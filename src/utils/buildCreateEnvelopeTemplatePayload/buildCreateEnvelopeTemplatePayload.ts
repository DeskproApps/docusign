import { CreateEnvelopeTemplateFormMeta } from "@/pages/envelopes/templates/send/schema";
import { CreateEnvelopeTemplatePayload } from "@/api/createEnvelopeTemplate/createEnvelopeTemplate";
import { Prettify } from "@/types/general";
import { v4 as uuidv4 } from "uuid";

export default function buildCreateEnvelopeTemplatePayload(data: Prettify<CreateEnvelopeTemplateFormMeta>): CreateEnvelopeTemplatePayload {

    const emailMessage = data.emailMessage
    const isValidEmailMessage = typeof emailMessage === "string" && emailMessage.trim() !== ""

    const payload: CreateEnvelopeTemplatePayload = {
        emailSubject: data.emailSubject,
        status: "sent",
        emailBlurb: isValidEmailMessage ? emailMessage : undefined,
        compositeTemplates: [
            {
                serverTemplates: [{
                    sequence: "1",
                    templateId: data.templateId
                }],
                inlineTemplates: [{
                    sequence: "2",
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
                                recipientId: uuidv4(),
                            }
                        })
                    }
                }]
            }
        ]
    }
    return payload
}