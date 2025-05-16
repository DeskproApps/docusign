import { ContextData } from "@/types/deskpro";
import { documentSchema, recipientsSchema } from "@/schemas/docusign";
import { z } from "zod";

export type CreateEnvelopeFormMeta = z.infer<typeof createEnvelopeSchema>

export const createEnvelopeSchema = z.object({
    emailSubject: z.string().min(1, "Subject cannot be empty."),
    emailBlurb: z.string().optional(),
    status: z.enum(["sent", "created"]),
    documents: z.array(documentSchema).min(1, "A file is required."),
    recipients: recipientsSchema,
})

export function setFormDefaultValues(deskproUser?: ContextData["user"]): CreateEnvelopeFormMeta {

    const defaultSignerName = deskproUser ? `${deskproUser.firstName} ${deskproUser.lastName}` : ""


    return {
        emailSubject: "",
        status: "sent",
        documents: [],
        recipients: {
            signers: [
                {
                    name: defaultSignerName,
                    fullName: defaultSignerName,
                    email: deskproUser?.primaryEmail ?? "",
                    recipientId: "1"
                }],
            carbonCopies: [],
        },
    }
}