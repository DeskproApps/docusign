import { Button, Stack } from "@deskpro/deskpro-ui";
import { ContextData } from "@/types/deskpro"
import { HorizontalDivider, LoadingSpinner, useDeskproAppEvents, useDeskproElements, useDeskproLatestAppContext } from "@deskpro/app-sdk"
import { useNavigate } from "react-router-dom"
import Callout from "@/components/Callout";
import CarbonCopyFields from "@/components/forms/CarbonCopyFields";
import EnvelopeTemplateDropdown from "./components/TemplateDropdown";
import ErrorText from "@/components/ErrorText";
import FormSection from "@/components/forms/FormSection";
import InputGroup from "@/components/InputGroup";
import SignerFields from "@/components/forms/SignerFields";
import useEnvelopeTemplates from "./hooks/useEnvelopeTemplates";
import useSendEnvelopeTemplateForm from "./hooks/useSendEnvelopeTemplateForm";

export default function SendEnvelopeTemplatePage() {
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
    const { formData, recipients: { signers, carbonCopies } } = useSendEnvelopeTemplateForm({ deskproUser })
    const { isLoading, templates } = useEnvelopeTemplates()

    const formHasVisibleErrors = Object.keys(formData.errors).length > 0

    if (isLoading){
        return <LoadingSpinner/>
    }

    return (
        <form onSubmit={formData.onSubmit}>
            <Stack vertical gap={8} style={{ width: "100%" }}>
                <FormSection headingText="Send a template">
                    <EnvelopeTemplateDropdown formData={formData} envelopeTemplates={templates}/>
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
                        hasError={!!formData.errors.emailSubject}
                        register={formData.register("emailMessage")}
                    />

                    <ErrorText>
                        {formData.errors.emailMessage?.message}
                    </ErrorText>

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
                        text={"Send"}
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