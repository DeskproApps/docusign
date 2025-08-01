import { Account } from "@/types/docusign/general";
import { ACCOUNT_BASE_URL_PATH, ACCOUNT_ID_PATH } from "@/constants/auth";
import { AnchorButton, H3, Stack } from "@deskpro/deskpro-ui";
import { useCallback } from "react";
import { useDeskproAppClient, useDeskproElements, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { useNavigate } from "react-router-dom";
import AccountSelect from "./components/AccountSelect";
import Callout from "@/components/Callout";
import TriggerRequests from "./components/TriggerRequests";
import useLogin from "./hooks/useLogin";


export default function LoginPage() {
    useInitialisedDeskproAppClient((client) => {
        client.setTitle("Docusign")
    }, [])

    useDeskproElements(({ registerElement, clearElements, deRegisterElement }) => {
        clearElements()
        deRegisterElement("home")
        deRegisterElement("menu")
        registerElement("refresh", { type: "refresh_button" })
    }, [])

    const { client } = useDeskproAppClient()
    const navigate = useNavigate()

    const onAccountConfirm = useCallback(async (account: Account) => {
        if (!client) {
            return
        }

        await client.setUserState(ACCOUNT_BASE_URL_PATH, account.base_uri)
        await client.setUserState(ACCOUNT_ID_PATH, account.account_id)
        navigate("/envelopes/list")
    }, [client, navigate])

    const { authURL, isLoading, onSignIn, error, userInfo, triggeredRequest } = useLogin()

    const anchorButtonIsDisabled = !authURL || isLoading || userInfo !== null
    return (
        <Stack vertical gap={16} padding={12}>
            <H3>Log into your Docusign account.</H3>
            <AnchorButton
                target="_blank"
                disabled={anchorButtonIsDisabled}
                href={authURL ?? ""}
                onClick={onSignIn}
                loading={isLoading}
                text={"Log In"}
            />

            <TriggerRequests request={triggeredRequest} />

            {error && <Callout style={{ width: "100%" }} accent="red">{error}</Callout>}

            {userInfo && (
                <AccountSelect onAccountConfirm={onAccountConfirm} user={userInfo} />
            )}
        </Stack>
    )
}