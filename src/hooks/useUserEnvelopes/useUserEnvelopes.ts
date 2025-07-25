import { getTemplates, getUserEnvelopes } from "@/api"
import { DocusignError, isErrorWithMessage } from "@/api/baseRequest"
import { IEnvelopeFromList } from "@/api/types"
import { useQueryWithClient } from "@deskpro/app-sdk"
import { useState } from "react"

interface UseUserEnvelopesReturn {
    isLoading: boolean,
    envelopes: IEnvelopeFromList[]
    error: string | null
    canViewTemplates: boolean
}

export default function useUserEnvelopes(userEmail: string): UseUserEnvelopesReturn {
    const [error, setError] = useState<string | null>(null)

    const userEnvelopesQuery = useQueryWithClient(
        ["userEnvelopes", userEmail],
        async (client) => {
            try {
                return await getUserEnvelopes(client, { userEmail })

            } catch (e) {
                let message = "Unknown error while retrieving envelopes."

                if (e instanceof DocusignError && isErrorWithMessage(e.data)) {
                    message = e.data.message
                } else if (e instanceof Error) {
                    message = e.message
                }

                setError(message)
                return null
            }
        },
        {
            enabled: userEmail.trim() !== ""
        }
    )

    const canViewTemplatesQuery = useQueryWithClient(
        ["templates"],
        async (client) => {
            try {

                await getTemplates(client)
                return true
            } catch (e) {
                if (e instanceof DocusignError && isErrorWithMessage(e.data) && e.data.errorCode === "USER_LACKS_PERMISSIONS") {
                    return false
                }

                // Pass other errors to the error boundary.
                throw e
            }
        }
    )

    const envelopes: IEnvelopeFromList[] = userEnvelopesQuery.data ?? []

    return {
        isLoading: userEnvelopesQuery.isLoading || canViewTemplatesQuery.isLoading,
        envelopes,
        error,
        canViewTemplates: canViewTemplatesQuery.data ?? false
    }

}