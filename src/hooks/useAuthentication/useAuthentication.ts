import { getAccountUsers } from "@/api";
import { parseAuthError } from "@/api/baseRequest";
import { useQueryWithClient } from "@deskpro/app-sdk";

interface UseAuthenticationParams {
  isSandboxAccount: boolean
  isUsingGlobalProxy: boolean
}
export default function useAuthentication(params: Readonly<UseAuthenticationParams>) {
  const { isUsingGlobalProxy, isSandboxAccount } = params
  const authStatusResponse = useQueryWithClient(
    ["authStatus", `isUsingGlobalProxy:${isUsingGlobalProxy}`, `isSandboxAccount:${isSandboxAccount}`],
    async (client) => {
      try {
        await Promise.all([
          client.setUserState("isSandboxAccount", isSandboxAccount),
          client.setUserState("isUsingGlobalProxy", isUsingGlobalProxy)
        ])

        const usersResponse = await getAccountUsers(client)

        // There should always be at least one user on an account.
        // If there isn't, whose account is this 🤔 ?
        if ((usersResponse.users?.length ?? 0) > 0) {
          return true
        }

        return false
      } catch (e: unknown) {

        // Auth related errors should be ignored while other errors
        // should be passed to the error boundary.
        const errorData = parseAuthError(e)

        if (errorData.type === "AUTH_ERROR") {
          return false
        }

        throw e
      }
    }
  )

  return {
    isLoading: authStatusResponse.isLoading,
    isAuthenticated: authStatusResponse.data ?? false
  }
}