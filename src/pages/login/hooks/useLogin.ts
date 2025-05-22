import { exchangeCodeForToken, getAuthenticatedUser } from "@/api"
import { ACCESS_TOKEN_PATH, REFRESH_TOKEN_PATH, SCOPES } from "@/constants/auth"
import { ContextData, ContextSettings } from "@/types/deskpro"
import { IUserInfo } from "@/types/docusign/general"
import { IOAuth2, OAuth2Result, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from "@deskpro/app-sdk"
import { useCallback, useState } from "react"
import { createSearchParams } from "react-router-dom"

interface UseLoginReturn {
    authURL: string | null,
    error: null | string,
    isLoading: boolean,
    onSignIn: () => void
    userInfo: IUserInfo | null,
}

export default function useLogin(): UseLoginReturn {
    const [authURL, setAuthURL] = useState<string | null>(null)
    const [error, setError] = useState<null | string>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isPolling, setIsPolling] = useState(false)
    const [oAuthContext, setOAuthContext] = useState<IOAuth2 | null>(null)
    const [userInfo, setUserInfo] = useState<IUserInfo | null>(null)
    const { context } = useDeskproLatestAppContext<ContextData, ContextSettings>()

    const settings = context?.settings
    const mode = settings?.use_advanced_connect === false ? 'global' : 'local'
    const integrationKey = settings?.integration_key

    useInitialisedDeskproAppClient(async (client) => {
        if (!settings) {
            // Make sure settings have loaded.
            return
        }

        // Local mode requires an integration key.
        if (mode === 'local' && (typeof integrationKey !== 'string' || integrationKey.trim() === "")) {
            setError("An integration key is required to proceed. Please contact your admin to ensure that the key is provided during the app setup.")
            return
        }

        const oAuthResponse = mode === "local" ?
            await client.startOauth2Local(
                ({ state, callbackUrl }) => {
                    return `https://account-d.docusign.com/oauth/auth?${createSearchParams([
                        ["response_type", "code"],
                        ["client_id", integrationKey ?? ""],
                        ["state", state],
                        ["redirect_uri", callbackUrl],
                        ["scope", SCOPES.join(" ")],
                    ]).toString()}`
                },
                /\bcode=(?<code>[^&#]+)/,
                async (code: string): Promise<OAuth2Result> => {
                    // Extract the callback URL from the authorization URL
                    const url = new URL(oAuthResponse.authorizationUrl)
                    const redirectUri = url.searchParams.get("redirect_uri")

                    if (!redirectUri) {
                        throw new Error("Failed to get callback URL")
                    }

                    const data: OAuth2Result["data"] = await exchangeCodeForToken(client, { code, redirect_uri: redirectUri })

                    return { data }
                }
            ) :
            // Global Proxy Service
            await client.startOauth2Global("")

        setAuthURL(oAuthResponse.authorizationUrl)
        setOAuthContext(oAuthResponse)
    }, [settings])

    useInitialisedDeskproAppClient((client) => {
        if (!oAuthContext) {
            return
        }

        const startPolling = async () => {
            try {
                const result = await oAuthContext.poll()

                await client.setUserState(ACCESS_TOKEN_PATH, result.data.access_token, { backend: true })

                if (result.data.refresh_token) {
                    await client.setUserState(REFRESH_TOKEN_PATH, result.data.refresh_token, { backend: true })
                }

                const activeUser = await getAuthenticatedUser(client)

                if (!activeUser) {
                    throw new Error("Error authenticating user.")
                }

                setUserInfo(activeUser)

            } catch (error) {
                setError(error instanceof Error ? error.message : 'Unknown error');
            } finally {
                setIsLoading(false)
                setIsPolling(false)
            }
        }

        if (isPolling) {
            void startPolling()
        }
    }, [isPolling, oAuthContext])


    const onSignIn = useCallback(() => {
        if (!authURL) {
            return
        }

        setIsLoading(true)
        setIsPolling(true)
        window.open(authURL, '_blank')
    }, [setIsLoading, authURL])

    return {
        authURL,
        error,
        isLoading,
        onSignIn,
        userInfo
    }
}