import { Button, Stack } from "@deskpro/deskpro-ui";
import { ContextData } from "@/types/deskpro";
import { HorizontalDivider, useDeskproAppEvents, useDeskproElements, useDeskproLatestAppContext } from "@deskpro/app-sdk";
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

export default function CreateEnvelopePage() {
    const { context } = useDeskproLatestAppContext<ContextData, unknown>()

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

    const { formData, recipients: { signers, carbonCopies } } = useCreateEnvelopeForm({ deskproUser })
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