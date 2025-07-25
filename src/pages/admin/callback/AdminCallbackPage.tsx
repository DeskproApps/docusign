import { CopyToClipboardInput, DeskproAppTheme, IOAuth2, LoadingSpinner, OAuth2Result, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { createSearchParams } from "react-router-dom";
import { P1 } from "@deskpro/deskpro-ui";
import { useState } from "react";
import styled from "styled-components";
import { SCOPES } from "@/constants/auth";


const Description = styled(P1)`
  margin-top: 8px;
  margin-bottom: 16px;
  color: ${({ theme }: DeskproAppTheme) => theme.colors.grey80};
`;

export default function AdminCallbackPage() {
    const [callbackUrl, setCallbackUrl] = useState<string | null>(null)

    useInitialisedDeskproAppClient(async (client) => {
        const oauth2: IOAuth2 = await client.startOauth2Local(
            ({ callbackUrl, state }: { callbackUrl: string; state: string }) => {
                return `https://xxx.docusign.com/oauth/auth?${createSearchParams([
                    ["response_type", "code"],
                    ["client_id", "xxx"],
                    ["state", state],
                    ["redirect_uri", callbackUrl],
                    ["scope", SCOPES.join(" ")],
                ]).toString()}`
            },
            /code=(?<code>[0-9a-f]+)/,
            async (): Promise<OAuth2Result> => {
                return { data: { access_token: "", refresh_token: "" } };
            }
        );

        const url = new URL(oauth2.authorizationUrl);
        const redirectUri = url.searchParams.get("redirect_uri")

        if (redirectUri) {
            setCallbackUrl(redirectUri)
        }
    }, [])

    if (!callbackUrl) {
        return (<LoadingSpinner />)
    }

    return (
        <>
            <CopyToClipboardInput value={callbackUrl} />
            <Description>The callback URL will be required during the Docusign app setup.</Description>
        </>
    );

}