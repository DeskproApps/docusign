import { getLinkedUserEntity } from "@/services"
import { UserEntityMetadata } from "@/services/setUserEntityLink"
import { ContextData } from "@/types/deskpro"
import { useDeskproLatestAppContext, useQueryWithClient } from "@deskpro/app-sdk"

export default function useLinkedUser() {
    const { context } = useDeskproLatestAppContext<ContextData, unknown>()
    const deskproUser = context?.data?.user

    const linkedEntityUserQuery = useQueryWithClient(
        ["linkedEntityUser", deskproUser?.id?? ""],
        async (client) => {
            return await getLinkedUserEntity(client, { userId: deskproUser?.id ?? ""  })
        },
        {
            enabled: !!deskproUser
        }
    )

    const linkedEntityUser = linkedEntityUserQuery.data
    const userDisplayName = deskproUser ? `${deskproUser.firstName} ${deskproUser.lastName}` : ""

    const linkedUser: UserEntityMetadata | null =
    !deskproUser
        ? null
        : linkedEntityUser ?? {
              name: userDisplayName,
              email: deskproUser.primaryEmail,
              id: deskproUser.id,
          }

    return { linkedUser }

} 