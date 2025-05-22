import { DocusignError, isErrorWithMessage } from "@/api/baseRequest"
import { getAccountUsers } from "@/api"
import { LoadingSpinner, useDeskproElements, useInitialisedDeskproAppClient } from "@deskpro/app-sdk"
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


    useInitialisedDeskproAppClient((client) => {
        client.setTitle("Docusign")

        getAccountUsers(client)
            .then((response) => {
                // There should always be at least one user on an account.
                // If there isn't, whose account is this 🤔 ?
                if ((response.users?.length ?? 0) > 0) {
                    setIsAuthenticated(true)
                }
            })
            .catch((error: unknown) => {
                let errorMessage = "Unknown error."

                if (error instanceof DocusignError && isErrorWithMessage(error.data)) {
                    errorMessage = error.data.message
                } else if (error instanceof Error) {
                    errorMessage = error.message
                }

                // eslint-disable-next-line no-console
                console.error("Error authenticating user: ", errorMessage)
                return
            })
            .finally(() => {
                setIsFetchingAuth(false)
            })
    }, [])

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