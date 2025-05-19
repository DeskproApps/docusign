import { ACCEPTED_FILE_TYPES } from "@/constants/general"
import { AttachmentTag, LabelButton, LabelButtonFileInput, P8, Stack } from "@deskpro/deskpro-ui"
import { faFile, faPlus } from "@fortawesome/free-solid-svg-icons";
import { UseCreateEnvelopeResult } from "../hooks/useCreateEnvelopeForm"
import { useDeskproAppTheme } from "@deskpro/app-sdk"
import ErrorText from "@/components/ErrorText";
import Required from "@/components/forms/Required"
import truncateFileName from "@/utils/truncateFileName"

interface UploadFileButtonProps {
    formData: UseCreateEnvelopeResult["formData"]
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
}

export default function UploadFileButton(props: UploadFileButtonProps) {
    const { formData, onFileChange } = props
    const uploadedFile = formData.values.get("documents")[0]

    const { theme } = useDeskproAppTheme()

    return (
        <Stack vertical style={{ width: "100%" }} gap={8}>
            <Stack vertical style={{ width: "100%" }}>
                <P8 style={{ color: theme?.colors?.grey80 }}>File <Required /></P8>

                {/* Show details of the uploaded file */}
                {uploadedFile && (
                    <AttachmentTag
                        download
                        filename={truncateFileName(uploadedFile.name, 20)}
                        fileSize={0}
                        icon={faFile}
                        withClose
                        onClose={() => {
                            formData.values.set("documents", [])
                        }}
                    />
                )}

                <LabelButton
                    style={{ padding: "0px" }}
                    icon={faPlus}
                    text="Add"
                    minimal
                >
                    <LabelButtonFileInput
                        accept={ACCEPTED_FILE_TYPES.join(",")}
                        data-testid="file-input"
                        onChange={onFileChange}
                    />
                </LabelButton>
            </Stack>

            <ErrorText>
                {formData.errors.documents?.message}
            </ErrorText>
        </Stack>
    )
}