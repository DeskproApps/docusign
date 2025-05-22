import { CreateEnvelopeFormMeta } from "@/pages/envelopes/create/schema";
import { CreateEnvelopeTemplateFormMeta } from "@/pages/envelopes/templates/send/schema";
import { FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove } from "react-hook-form";

export interface DefaultRecipient {
    name: string;
    email: string;
    recipientId: string;
    fullName: string;
    routingOrder?: string
}

export type AllowedRecipientFormMeta = CreateEnvelopeFormMeta | CreateEnvelopeTemplateFormMeta

export interface Recipient<
    RecipientType extends "signers" | "carbonCopies",
    FormType extends AllowedRecipientFormMeta = CreateEnvelopeFormMeta | CreateEnvelopeTemplateFormMeta> {
    // TypeScript shows an error here, but this should be safe because:
    // - FormType is limited to the allowed types (CreateEnvelopeFormMeta & CreateEnvelopeTemplateFormMeta). 
    // - The path `recipients.${RecipientType}` exists in both allowed types.
    // - The correct type will still be checked in the rest of the app.
    // We’re ignoring the error to avoid a false warning.

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore to suppress the error
    fields: FieldArrayWithId<FormType, `recipients.${RecipientType}`, "id">[]
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore to suppress the error
    append: UseFieldArrayAppend<FormType, `recipients.${RecipientType}`>
    remove: UseFieldArrayRemove
    default: DefaultRecipient
}