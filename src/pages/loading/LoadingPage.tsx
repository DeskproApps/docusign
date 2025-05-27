import { ContextData, ContextSettings } from "@/types/deskpro"
import { parseAuthError } from "@/api/baseRequest"
import { getAccountUsers } from "@/api"
import { LoadingSpinner, useDeskproElements, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from "@deskpro/app-sdk"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function LoadingPage() {
    useDeskproElements(({ registerElement, clearElements, deRegisterElement }) => {
        clearElements()
        deRegisterElement("home")
        deRegisterElement("menu")
        registerElement("refresh", { type: "refresh_button" })
    }, [])

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [isFetchingAuth, setIsFetchingAuth] = useState<boolean>(true)
    const navigate = useNavigate()

    const { context } = useDeskproLatestAppContext<ContextData, ContextSettings>()

    const settings = context?.settings
    const isSandboxAccount = settings?.use_advanced_connect !== false && settings?.use_sandbox_account === true
    const isUsingGlobalProxy = settings?.use_advanced_connect === false

    useInitialisedDeskproAppClient((client) => {
        client.setTitle("Docusign")

        if (!settings) {
            return
        }

        client.setUserState("isSandboxAccount", isSandboxAccount)
        client.setUserState("isUsingGlobalProxy", isUsingGlobalProxy)

        getAccountUsers(client)
            .then((response) => {
                // There should always be at least one user on an account.
                // If there isn't, whose account is this 🤔 ?
                if ((response.users?.length ?? 0) > 0) {
                    setIsAuthenticated(true)
                }
            })
            .catch((error: unknown) => {
                // Auth related errors should lead to the user being
                // redirected to the login page while other errors
                // should be passed to the error boundary.
                const errorData = parseAuthError(error)

                if (errorData.type !== "AUTH_ERROR") {
                    throw error
                }
            })
            .finally(() => {
                setIsFetchingAuth(false)
            })
    }, [settings])

    if (isFetchingAuth) {
        return (<LoadingSpinner />)
    }

    if (!isAuthenticated) {
        navigate("/login")
        return (<LoadingSpinner />)
    }


    navigate("/envelopes/list")
    return (<LoadingSpinner />)
}