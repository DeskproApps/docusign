import { createEnvelope } from "@/api"
import { CreateEnvelopeFormMeta, createEnvelopeSchema, setFormDefaultValues } from "../schema"
import { CreateEnvelopePayload } from "@/api/createEnvelope"
import { DefaultRecipient, Recipient } from "@/types/docusign/form"
import { FieldErrors, useFieldArray, useForm, UseFormClearErrors, UseFormRegister, UseFormSetError, UseFormSetValue, UseFormWatch } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { useQueryMutationWithClient } from "@/hooks/useQueryMutation"
import { UserEntityMetadata } from "@/services"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import buildCreateEnvelopePayload from "@/utils/buildCreateEnvelopePayload"

interface UseCreateEnvelopeFormParams {
    linkedUser: UserEntityMetadata | undefined
}

export interface UseCreateEnvelopeResult {
    formData: {
        register: UseFormRegister<CreateEnvelopeFormMeta>,
        clearErrors: UseFormClearErrors<CreateEnvelopeFormMeta>,
        setError: UseFormSetError<CreateEnvelopeFormMeta>,
        errors: FieldErrors<CreateEnvelopeFormMeta>,
        values: {
            set: UseFormSetValue<CreateEnvelopeFormMeta>,
            get: UseFormWatch<CreateEnvelopeFormMeta>
        },
        onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
        isSubmitting: boolean,
        fetchError: string | null

    },
    recipients: {
        signers: Recipient<"signers", CreateEnvelopeFormMeta>,
        carbonCopies?: Recipient<"carbonCopies", CreateEnvelopeFormMeta>
    }
}

export default function useCreateEnvelopeForm(params: Readonly<UseCreateEnvelopeFormParams>): UseCreateEnvelopeResult {
    const { linkedUser } = params
    const [fetchError, setFetchError] = useState<string | null>(null)
    const navigate = useNavigate()

    const { register, clearErrors, control, formState: { errors }, handleSubmit, setValue, watch: getValue, setError } = useForm<CreateEnvelopeFormMeta>({
        resolver: zodResolver(createEnvelopeSchema),
        defaultValues: setFormDefaultValues(linkedUser)
    })

    const { fields: signerFields, append: appendSigner, remove: removeSigner } = useFieldArray({
        control,
        name: "recipients.signers",
    })

    const { fields: carbonCopyFields, append: appendCarbonCopy, remove: removeCarbonCopy } = useFieldArray({
        control,
        name: "recipients.carbonCopies",
    })

    const defaultRecipient: DefaultRecipient = {
        name: "",
        email: "",
        recipientId: "",
        fullName: ""
    }

    const carbonCopies: Recipient<"carbonCopies", CreateEnvelopeFormMeta> = {
        fields: carbonCopyFields,
        append: appendCarbonCopy,
        remove: removeCarbonCopy,
        default: defaultRecipient
    }

    const signers: Recipient<"signers", CreateEnvelopeFormMeta> = {
        fields: signerFields,
        append: appendSigner,
        remove: removeSigner,
        default: defaultRecipient
    }

    const formValues = {
        get: getValue,
        set: setValue
    }

    const submitFormMutation = useQueryMutationWithClient<CreateEnvelopePayload, void>(async (client, data) => {
        return await createEnvelope(client, data)
    }
    )

    async function onSubmit(formData: CreateEnvelopeFormMeta): Promise<void> {
        setFetchError(null)

        if (!formData.documents || formData.documents.length < 1) {
            setError("documents",
                {
                    type: "manual",
                    message: "A file is required."
                }
            )
            return
        }

        const envelopePayload = buildCreateEnvelopePayload(formData)

        await submitFormMutation.mutateAsync(envelopePayload, {
            onSuccess: () => {
                void navigate("/")
            },
            onError: (e) => {
                setFetchError(e instanceof Error ? e.message : "An unexpected error occurred while creating the envelope.")
            }
        })
    }

    return {
        formData: {
            register,
            clearErrors,
            setError,
            errors,
            values: formValues,
            onSubmit: handleSubmit(onSubmit),
            isSubmitting: submitFormMutation.isLoading,
            fetchError
        },
        recipients: {
            signers,
            carbonCopies,
        },
    }

}