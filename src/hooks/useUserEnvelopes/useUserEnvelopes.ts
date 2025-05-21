import { getUserEnvelopes } from "@/api"
import { DocusignError, isErrorWithMessage } from "@/api/baseRequest"
import { IEnvelopeFromList } from "@/api/types"
import { useQueryWithClient } from "@deskpro/app-sdk"
import { useState } from "react"

interface UseUserEnvelopesReturn {
    isLoading: boolean,
    envelopes: IEnvelopeFromList[]
    error: string | null
}

export default function useUserEnvelopes(userEmail: string): UseUserEnvelopesReturn {
    const [error, setError] = useState<string | null>(null)

    const userEnvelopesQuery = useQueryWithClient(
        ["userEnvelopes", userEmail],
        async (client) => {
            try {
                return await getUserEnvelopes(client, userEmail)

            } catch (e) {
                let message = "Unknown error while retrieving envelopes."

                if (e instanceof DocusignError && isErrorWithMessage(e.data)) {
                    message = e.data.message
                } else if (e instanceof Error) {
                    message = e.message
                }

                setError(message)
            }
        },
        {
            enabled: userEmail.trim() !== ""
        }
    )

    const envelopes: IEnvelopeFromList[] = userEnvelopesQuery.data ?? []

    return {
        isLoading: userEnvelopesQuery.isLoading,
        envelopes,
        error
    }

}