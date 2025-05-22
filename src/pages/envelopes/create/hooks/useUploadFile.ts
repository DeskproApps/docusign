import fileToBase64 from "@/utils/fileToBase64"
import { ChangeEvent } from "react"
import { UseCreateEnvelopeResult } from "./useCreateEnvelopeForm"

type UploadFileParams = {
    form: UseCreateEnvelopeResult["formData"]
}

export default function useUploadFile(params: UploadFileParams) {
    const { form: { setError, clearErrors, values: { set: setValue } } } = params

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
                documentId: "1",
            }

            clearErrors("documents")
            setValue("documents", [attachmentInfo])
        } catch {
            setError("documents", {
                type: "manual",
                message: "Error uploading file.",
            })
        }
    }

    return {
        onFileChange: handleFileChange
    }
}