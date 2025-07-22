import { ContextData, ContextSettings } from "@/types/deskpro"
import { LoadingSpinner, useDeskproElements, useDeskproLatestAppContext } from "@deskpro/app-sdk"
import { useNavigate } from "react-router-dom"
import useAuthentication from "@/hooks/useAuthentication"

export default function LoadingPage() {
    useDeskproElements(({ registerElement, clearElements, deRegisterElement }) => {
        clearElements()
        deRegisterElement("home")
        deRegisterElement("menu")
        registerElement("refresh", { type: "refresh_button" })
    }, [])

    const navigate = useNavigate()

    const { context } = useDeskproLatestAppContext<ContextData, ContextSettings>()

    const settings = context?.settings
    const isSandboxAccount = settings?.use_advanced_connect !== false && settings?.use_sandbox_account === true
    const isUsingGlobalProxy = settings?.use_advanced_connect === false
    const { isLoading, isAuthenticated } = useAuthentication({ isSandboxAccount, isUsingGlobalProxy })

    if (isLoading) {
        return (<LoadingSpinner />)
    }

    if (!isAuthenticated) {
        navigate("/login")
        return (<LoadingSpinner />)
    }

    navigate("/envelopes/list")
    return (<LoadingSpinner />)
}