import { z } from "zod";

export const documentSchema = z.object({
    documentBase64: z.string(),
    name: z.string(),
    fileExtension: z.string(),
    documentId: z.string(),
})

export const signerSchema = z.object({
    email: z.string().email("Enter a valid email."),
    name: z.string().min(1, "Name cannot be empty."),
    fullName: z.string(),
    recipientId: z.string(),
    routingOrder: z.string().optional()
})

export const ccSchema = z.object({
    email: z.string().email("Enter a valid email."),
    name: z.string().min(1, "Name cannot be empty."),
    fullName: z.string(),
    recipientId: z.string(),
    routingOrder: z.string().optional(),
})

export const recipientsSchema = z.object({
    signers: z.array(signerSchema).min(1, "At least one signer is required."),
    carbonCopies: z.array(ccSchema).optional(),
})

