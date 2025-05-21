import { createEnvelopeTemplate } from "@/api";
import { CreateEnvelopeTemplateFormMeta, setFormDefaultValues, createEnvelopeTemplateSchema } from "../schema";
import { CreateEnvelopeTemplatePayload } from "@/api/createEnvelopeTemplate/createEnvelopeTemplate";
import { DefaultRecipient, Recipient } from "@/types/docusign/form";
import { FieldErrors, useFieldArray, useForm, UseFormClearErrors, UseFormRegister, UseFormSetError, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useQueryMutationWithClient } from "@/hooks/useQueryMutation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import buildCreateEnvelopeTemplatePayload from "@/utils/buildCreateEnvelopeTemplatePayload";
import { UserEntityMetadata } from "@/services";

interface UseSendEnvelopeTemplateFormParams {
    linkedUser: UserEntityMetadata | undefined
}

export interface UseSendEnvelopeTemplateForm {
    formData: {
        register: UseFormRegister<CreateEnvelopeTemplateFormMeta>,
        clearErrors: UseFormClearErrors<CreateEnvelopeTemplateFormMeta>,
        setError: UseFormSetError<CreateEnvelopeTemplateFormMeta>,
        errors: FieldErrors<CreateEnvelopeTemplateFormMeta>,
        values: {
            set: UseFormSetValue<CreateEnvelopeTemplateFormMeta>,
            get: UseFormWatch<CreateEnvelopeTemplateFormMeta>
        },
        onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>
        isSubmitting: boolean,
        fetchError: string | null

    },
    recipients: {
        signers: Recipient<"signers", CreateEnvelopeTemplateFormMeta>,
        carbonCopies?: Recipient<"carbonCopies", CreateEnvelopeTemplateFormMeta>
    }
}

export default function useSendEnvelopeTemplateForm(params: Readonly<UseSendEnvelopeTemplateFormParams>): UseSendEnvelopeTemplateForm {
    const { linkedUser } = params
    const [fetchError, setFetchError] = useState<string | null>(null)
    const navigate = useNavigate()

    const { register, clearErrors, control, formState: { errors }, handleSubmit, setValue, watch: getValue, setError } = useForm<CreateEnvelopeTemplateFormMeta>({
        resolver: zodResolver(createEnvelopeTemplateSchema),
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

    const carbonCopies: Recipient<"carbonCopies", CreateEnvelopeTemplateFormMeta> = {
        fields: carbonCopyFields,
        append: appendCarbonCopy,
        remove: removeCarbonCopy,
        default: defaultRecipient
    }

    const signers: Recipient<"signers", CreateEnvelopeTemplateFormMeta> = {
        fields: signerFields,
        append: appendSigner,
        remove: removeSigner,
        default: defaultRecipient
    }

    const formValues = {
        get: getValue,
        set: setValue
    }

    const submitFormMutation = useQueryMutationWithClient<CreateEnvelopeTemplatePayload, void>(async (client, data) => {
        return createEnvelopeTemplate(client, data)
    }
    )

    async function onSubmit(formData: CreateEnvelopeTemplateFormMeta): Promise<void> {
        setFetchError(null)

        const envelopePayload = buildCreateEnvelopeTemplatePayload(formData)

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
        }
    }

}