import { documentSchema, recipientsSchema } from "@/schemas/docusign";
import { UserEntityMetadata } from "@/services";
import { z } from "zod";

export interface CreateEnvelopeFormMeta extends z.infer<typeof createEnvelopeSchema>{
    kind: "create-envelope"
}

export const createEnvelopeSchema = z.object({
    emailSubject: z.string().min(1, "Subject cannot be empty."),
    emailBlurb: z.string().optional(),
    status: z.enum(["sent", "created"]),
    documents: z.array(documentSchema).min(1, "A file is required."),
    recipients: recipientsSchema,
})

export function setFormDefaultValues(linkedUser?: UserEntityMetadata): CreateEnvelopeFormMeta {

    return {
        kind: "create-envelope",
        emailSubject: "",
        status: "sent",
        documents: [],
        recipients: {
            signers: [
                {
                    name: linkedUser?.name ?? "",
                    fullName: linkedUser?.name ?? "",
                    email: linkedUser?.email ?? "",
                    recipientId: "1"
                }],
            carbonCopies: [],
        },
    }
}