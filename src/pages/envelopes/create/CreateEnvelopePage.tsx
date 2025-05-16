import { AnyIcon, AttachmentTag, Button, H1, H2, LabelButton, LabelButtonFileInput, P8, Stack } from "@deskpro/deskpro-ui";
import { ChangeEvent, Fragment, useState } from "react";
import { ContextData } from "@/types/deskpro";
import { CreateEnvelopeFormMeta, createEnvelopeSchema, setFormDefaultValues, } from "./schema";
import { faFile, faPlus } from "@fortawesome/free-solid-svg-icons";
import { HorizontalDivider, useDeskproAppEvents, useDeskproAppTheme, useDeskproElements, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useQueryMutationWithClient } from "@/hooks/useQueryMutation";
import { v4 as uuidv4 } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";
import Callout from "@/components/Callout";
import createEnvelope, { CreateEnvelopePayload } from "@/api/createEnvelope";
import ErrorText from "@/components/ErrorText";
import fileToBase64 from "@/utils/fileToBase64";
import InputGroup from "@/components/InputGroup";

export default function CreateEnvelopePage() {
    const { theme } = useDeskproAppTheme()
    const { context } = useDeskproLatestAppContext<ContextData, unknown>()
    const [fetchError, setFetchError] = useState<string | null>(null)

    const navigate = useNavigate()

    useDeskproElements(({ clearElements, registerElement }) => {
        clearElements()
        registerElement("home", { type: "home_button" })
        registerElement("refresh", { type: "refresh_button" })
    }, [])

    useDeskproAppEvents({
        async onElementEvent(id,) {
            switch (id) {
                case "home":
                    void navigate("/")
            }
        },
    })

    const deskproUser = context?.data?.user

    const { register, clearErrors, control, formState: { errors }, handleSubmit, setValue, watch: getValue, setError } = useForm<CreateEnvelopeFormMeta>({
        resolver: zodResolver(createEnvelopeSchema),
        defaultValues: setFormDefaultValues(deskproUser)
    })

    const { fields: signerFields, append: appendSigner, remove: removeSigner } = useFieldArray({
        control,
        name: "recipients.signers",
    })

    const { fields: carbonCopyFields, append: appendCarbonCopy, remove: removeCarbonCopy } = useFieldArray({
        control,
        name: "recipients.carbonCopies",
    })

    const submitMutation = useQueryMutationWithClient<CreateEnvelopePayload, void>((client, data) => {
        return createEnvelope(client, data)
    }
    )

    // Process the form data on successful submit(Form values are valid)
    async function onSubmit(formData: CreateEnvelopeFormMeta): Promise<void> {

        if (!formData.documents || formData.documents.length < 1) {
            setError("documents",
                {
                    type: "manual",
                    message: "A file is required."
                }
            )
            return
        }

        const envelopePayload = {
            emailSubject: formData.emailSubject,
            status: "sent",
            documents: formData.documents.filter((document) => document !== undefined),
            recipients: {
                signers: formData.recipients.signers.map((signer) => {
                    return {
                        name: signer.name,
                        email: signer.email,
                        fullName: signer.name,
                        recipientId: uuidv4()
                    }
                }),
                carbonCopies: formData.recipients.carbonCopies?.map((carbonCopy) => {
                    return {
                        name: carbonCopy.name,
                        email: carbonCopy.email,
                        fullName: carbonCopy.name,
                        recipientId: uuidv4()
                    }
                })
            }
        }

        submitMutation.mutateAsync(envelopePayload, {
            onSuccess: () => {
                void navigate("/")
            },
            onError: (e) => {
                setFetchError(e instanceof Error ? e.message : "An unexpected error occurred while creating the envelope.")
            }
        })
    }

    async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        try {
            const file = e.target?.files?.[0]
            if (!file) {
                setValue("documents", [])
                return
            }

            const attachmentInfo = {
                documentBase64: await fileToBase64(file),
                name: file.name,
                fileExtension: file.type.split("/")[1],
                documentId: "1"
            }

            clearErrors("documents")
            setValue("documents", [attachmentInfo])
        }
        catch {
            setError("documents",
                {
                    type: "manual",
                    message: "Error uploading file."
                }
            )
        }

    }

    const uploadedFile = getValue("documents")[0]
    const formHasVisibleErrors = Object.keys(errors).length > 0

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack vertical gap={8} style={{ width: "100%" }}>
                {/* Envelope Info Section */}
                <Stack vertical gap={8} padding={12} style={{ width: "100%" }}>
                    <H1>Create an envelope</H1>

                    <InputGroup
                        type="text"
                        label="Email Subject"
                        name="emailSubject"
                        hasError={!!errors.emailSubject}
                        required
                        register={register("emailSubject")}
                    />
                    <ErrorText>
                        {errors.emailSubject?.message}
                    </ErrorText>

                    {/* File Upload Button */}
                    <Stack vertical style={{ width: "100%" }}>
                        <P8 style={{ color: theme?.colors?.grey80 }}>File <span style={{ color: theme?.colors?.red100 }}>
                            *
                        </span>
                        </P8>

                        {/* Show details of the uploaded file */}
                        {uploadedFile && (
                            <AttachmentTag
                                download
                                filename={
                                    uploadedFile.name.length > 19
                                        ? `${uploadedFile.name.substring(0, 19)}...`
                                        : uploadedFile.name
                                }
                                fileSize={0}
                                icon={faFile}
                                withClose
                                onClose={() => {
                                    setValue("documents", [])
                                }}
                            />
                        )}

                        <LabelButton
                            style={{ padding: "0px" }}
                            icon={faPlus as AnyIcon}
                            text="Add"
                            minimal
                        >
                            <LabelButtonFileInput
                                accept="image/jpeg, image/jpg, image/png, image/pjpeg, application/pdf, application/word, application/doc, application/docx"
                                data-testid="file-input"
                                onChange={handleFileChange}
                            />
                        </LabelButton>

                    </Stack>
                    <ErrorText>
                        {errors.documents?.message}
                    </ErrorText>
                </Stack>

                <HorizontalDivider style={{ width: "100%" }} />

                {/* Signers Section. */}
                <Stack vertical gap={12} padding={12} style={{ width: "100%" }}>
                    <H2 style={{ fontSize: "12px", fontWeight: 500 }}>Add a signer</H2>
                    {signerFields.map((field, index) => (
                        <Fragment key={field.id}>
                            {/* Signer Name Input. */}
                            <InputGroup
                                type="text"
                                label="Signer Name"
                                defaultValue={signerFields[index].name ?? ""}
                                hasError={!!errors.recipients?.signers?.[index]?.name}
                                required
                                name={`recipients.signers.${index}.name`}
                                register={register(`recipients.signers.${index}.name`)}
                            />
                            <ErrorText>
                                {errors.recipients?.signers?.[index]?.name?.message}
                            </ErrorText>

                            {/* Signer Email Input. */}
                            <InputGroup
                                type="email"
                                label="Signer Email"
                                defaultValue={signerFields[index].email ?? ""}
                                hasError={!!errors.recipients?.signers?.[index]?.email}
                                required
                                name={`recipients.signers.${index}.email`}
                                register={register(`recipients.signers.${index}.email`)}
                            />
                            <ErrorText>
                                {errors.recipients?.signers?.[index]?.email?.message}
                            </ErrorText>

                            {/* Remove Signer Button. */}
                            {/* There must be at least one signer. */}
                            {index !== 0 && (<Button intent="secondary" text="Remove" onClick={() => {
                                removeSigner(index)
                            }} />)}

                            {/* Don't show the divider for the last element. */}
                            {index + 1 !== signerFields.length && (<HorizontalDivider style={{ width: "100%" }} />)}
                        </Fragment>
                    ))}

                    {/* Add Signer Button. */}
                    <Button intent="secondary" text="Add another signer" onClick={() => {
                        appendSigner({
                            name: "",
                            email: "",
                            recipientId: "",
                            fullName: ""
                        })
                    }} />
                </Stack>

                <HorizontalDivider style={{ width: "100%" }} />

                {/* CC Section. */}
                <Stack vertical gap={8} padding={12}>
                    <H2 style={{ fontSize: "12px", fontWeight: 500 }}>Add a CC</H2>
                    {carbonCopyFields.map((field, index) => (
                        <Fragment key={field.id}>
                            {/* CC Recipient Name */}
                            <InputGroup
                                type="text"
                                label="Recipient Name"
                                hasError={!!errors.recipients?.carbonCopies?.[index]?.name}
                                required
                                name={`recipients.carbonCopies.${index}.name`}
                                register={register(`recipients.carbonCopies.${index}.name`)}
                            />
                            <ErrorText>
                                {errors.recipients?.carbonCopies?.[index]?.name?.message}
                            </ErrorText>

                            {/* CC Recipient Email */}
                            <InputGroup
                                type="email"
                                label="Recipient Email"
                                hasError={!!errors.recipients?.carbonCopies?.[index]?.email}
                                required
                                name={`recipients.carbonCopies.${index}.email`}
                                register={register(`recipients.carbonCopies.${index}.email`)}
                            />
                            <ErrorText>
                                {errors.recipients?.carbonCopies?.[index]?.email?.message}
                            </ErrorText>

                            {/* Remove CC Button. */}
                            <Button intent="secondary" text="Remove" onClick={() => {
                                removeCarbonCopy(index)
                            }} />

                            {/* Don't show the divider for the last element. */}
                            {index + 1 !== carbonCopyFields.length && (<HorizontalDivider style={{ width: "100%" }} />)}
                        </Fragment>
                    ))}

                    {/* Add Carbon Copy Button. */}
                    <Button intent="secondary" text="Add another CC" onClick={() => {
                        appendCarbonCopy({
                            name: "",
                            email: "",
                            recipientId: "",
                            fullName: ""
                        })
                    }} />
                </Stack>

                {/* Error Callout */}
                {fetchError && (
                    <Stack style={{ width: "100%" }} padding={12}>
                        <Callout
                            accent="red"
                            style={{ width: "100%" }}
                        >
                            An error occurred while creating the envelope
                        </Callout>
                    </Stack>
                )}

                {/* Action Buttons. */}
                <Stack gap={8} padding={12} justify="space-between" style={{ width: "100%" }}>
                    <Button
                        style={{ cursor: (formHasVisibleErrors || submitMutation.isLoading) ? "not-allowed" : "default" }}
                        type="submit"
                        text={submitMutation.isLoading ? "Creating" : "Create"}
                        disabled={formHasVisibleErrors || submitMutation.isLoading}
                    />

                    <Button
                        intent="secondary"
                        type="button"
                        onClick={() => { void navigate("/") }}
                        text="Cancel"
                    />
                </Stack>


            </Stack>
        </form>
    )
}