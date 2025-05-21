import { Button, Stack } from "@deskpro/deskpro-ui";
import { HorizontalDivider, useDeskproElements, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { useNavigate } from "react-router-dom";
import Callout from "@/components/Callout";
import CarbonCopyFields from "@/components/forms/CarbonCopyFields";
import ErrorText from "@/components/ErrorText";
import FormSection from "@/components/forms/FormSection";
import InputGroup from "@/components/InputGroup";
import SignerFields from "@/components/forms/SignerFields";
import useCreateEnvelopeForm from "./hooks/useCreateEnvelopeForm";
import useUploadFile from "./hooks/useUploadFile";
import UploadFileButton from "./components/UploadFileButton";
import useLinkedUser from "@/hooks/useLinkedUser";

export default function CreateEnvelopePage() {
    const navigate = useNavigate()

    // Set the nav elements.
    useDeskproElements(({ clearElements, registerElement }) => {
        clearElements()
        registerElement("home", {
            type: "home_button",
            payload: { type: "changePath", path: "/" },
        })
        registerElement("refresh", { type: "refresh_button" })
        registerElement("menu", {
            type: "menu",
            items: [
                {
                    title: "Unlink User",
                    payload: {
                        type: "unlink",
                    },
                }
            ]
        })
    }, [])

    // Set the header title.
    useInitialisedDeskproAppClient((client) => {
        client.setTitle("Docusign")
    }, [])

    const { linkedUser } = useLinkedUser()

    const { formData, recipients: { signers, carbonCopies } } = useCreateEnvelopeForm({ linkedUser: linkedUser ?? undefined })
    const { onFileChange } = useUploadFile({ form: formData })

    const formHasVisibleErrors = Object.keys(formData.errors).length > 0

    return (
        <form onSubmit={formData.onSubmit}>
            <Stack vertical gap={8} style={{ width: "100%" }}>
                {/* Envelope Info Section. */}
                <FormSection headingText="Create an envelope">
                    <InputGroup
                        type="text"
                        label="Email Subject"
                        name="emailSubject"
                        hasError={!!formData.errors.emailSubject}
                        required
                        register={formData.register("emailSubject")}
                    />
                    <ErrorText>
                        {formData.errors.emailSubject?.message}
                    </ErrorText>

                    <InputGroup
                        type="text"
                        label="Email Message"
                        name="emailMessage"
                        hasError={!!formData.errors.emailBlurb}
                        register={formData.register("emailBlurb")}
                    />
                    <ErrorText>
                        {formData.errors.emailBlurb?.message}
                    </ErrorText>

                    {/* File Upload Button. */}
                    <UploadFileButton formData={formData} onFileChange={onFileChange} />
                </FormSection>

                <HorizontalDivider style={{ width: "100%" }} />

                {/* Signers Section. */}
                <FormSection headingText="Add a signer">
                    <SignerFields signerErrors={formData.errors.recipients?.signers} signers={signers} register={formData.register} />

                </FormSection>

                <HorizontalDivider style={{ width: "100%" }} />

                {/* CC Section. */}
                <FormSection headingText="Add a CC">
                    <CarbonCopyFields carbonCopies={carbonCopies} carbonCopyErrors={formData.errors.recipients?.carbonCopies} register={formData.register} />
                </FormSection>

                {/* Error Callout */}
                {formData.fetchError && (
                    <Stack style={{ width: "100%" }} padding={12}>
                        <Callout
                            accent="red"
                            style={{ width: "100%" }}
                        >
                            {formData.fetchError}
                        </Callout>
                    </Stack>
                )}

                {/* Action Buttons. */}
                <Stack gap={8} padding={12} justify="space-between" style={{ width: "100%" }}>
                    <Button
                        style={{ cursor: (formHasVisibleErrors || formData.isSubmitting) ? "not-allowed" : "pointer" }}
                        type="submit"
                        text={"Create"}
                        loading={formData.isSubmitting}
                        disabled={formHasVisibleErrors || formData.isSubmitting}
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