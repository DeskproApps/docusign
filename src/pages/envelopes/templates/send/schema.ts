import { ContextData } from "@/types/deskpro";
import { recipientsSchema } from "@/schemas/docusign";
import { z } from "zod";

export const createEnvelopeTemplateSchema = z.object({
    templateId: z.string().min(1, "A template is required."),
    emailSubject: z.string().min(1, "Subject cannot be empty."),
    emailBlurb: z.string().optional(),
    emailMessage: z.string().optional(),
    status: z.enum(["sent", "created"]),
    recipients: recipientsSchema,
})

export interface CreateEnvelopeTemplateFormMeta extends z.infer<typeof createEnvelopeTemplateSchema> {
    kind: "create-envelope-template"
}

export function setFormDefaultValues(deskproUser?: ContextData["user"]): CreateEnvelopeTemplateFormMeta {

    const defaultSignerName = deskproUser ? `${deskproUser.firstName} ${deskproUser.lastName}` : ""

    return {
        kind: "create-envelope-template",
        templateId: "",
        emailSubject: "",
        status: "sent",
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