import { recipientsSchema } from "@/schemas/docusign";
import { z } from "zod";
import { UserEntityMetadata } from "@/services";

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

export function setFormDefaultValues(linkedUser?: UserEntityMetadata): CreateEnvelopeTemplateFormMeta {
    return {
        kind: "create-envelope-template",
        templateId: "",
        emailSubject: "",
        status: "sent",
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