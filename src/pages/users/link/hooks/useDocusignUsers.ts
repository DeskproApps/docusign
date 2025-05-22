import getUsersByQuery, { SEARCH_QUERY_MIN_LENGTH } from "@/api/getUsersByQuery"
import { setUserEntityLink } from "@/services"
import { ContextData } from "@/types/deskpro"
import { useDeskproAppClient, useDeskproLatestAppContext, useQueryWithClient } from "@deskpro/app-sdk"
import { useCallback, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"

export interface UseDocusignUsersReturn {
    users: {
        name?: string,
        userId: string,
        email: string
    }[],
    isLinking: boolean
    isLoading: boolean
    onLinkUser: () => void
}

export default function useDocusignUsers(searchQuery: string, selectedUserId: string | undefined): UseDocusignUsersReturn {
    const isValidSearchLength = searchQuery.length >= SEARCH_QUERY_MIN_LENGTH
    const { client } = useDeskproAppClient()
    const { context } = useDeskproLatestAppContext<ContextData, unknown>()
    const deskproUser = context?.data?.user
    const [isLinking, setIsLinking] = useState<boolean>(false)
    const navigate = useNavigate()

    const usersResponse = useQueryWithClient(
        ["linkUsers", searchQuery],
        async (client) => {
            return await getUsersByQuery(client, searchQuery)
        },
        { enabled: isValidSearchLength }
    )

    const users = useMemo(() => {
        return isValidSearchLength ? usersResponse.data ?? [] : [];
    }, [isValidSearchLength, usersResponse.data])

    const onLinkUser = useCallback(() => {
        if (!client || !deskproUser?.id || !selectedUserId) {
            return
        }
        const activeUser = users.find((user) => {
           return user.userId === selectedUserId
        })

        if (!activeUser) {
            return 
        }

        const userMeta = {
            name: activeUser.name,
            email: activeUser.email,
            id: activeUser.userId
        }

        setIsLinking(true)

        setUserEntityLink(client, { userId: deskproUser.id, email: activeUser.email, metadata: userMeta })
            .then(() => {
                void navigate("/envelopes/list")
            })
            .catch(() => { 
                return
            })
            .finally(() => {
                setIsLinking(false)
            })
    }, [client, deskproUser?.id, navigate, selectedUserId, users])

    return {
        isLoading: isValidSearchLength && usersResponse.isLoading,
        users,
        isLinking,
        onLinkUser
    }

}