import { CreateEnvelopeFormMeta } from "@/pages/envelopes/create/schema";
import { FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove } from "react-hook-form";

export interface DefaultRecipient {
    name: string;
    email: string;
    recipientId: string;
    fullName: string;
    routingOrder?: string
}
export interface Recipient<RecipientType extends "signers" | "carbonCopies"> {
    fields: FieldArrayWithId<CreateEnvelopeFormMeta, `recipients.${RecipientType}`, "id">[]
    append: UseFieldArrayAppend<CreateEnvelopeFormMeta, `recipients.${RecipientType}`>
    remove: UseFieldArrayRemove
    default: DefaultRecipient
}