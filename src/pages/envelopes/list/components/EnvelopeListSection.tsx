import { DeskproTheme, H1, Stack } from "@deskpro/deskpro-ui";
import { Fragment } from "react";
import { HorizontalDivider } from "@deskpro/app-sdk";
import { IEnvelopeFromList } from "@/api/types";
import { NavigateFunction } from "react-router-dom";
import { UserEntityMetadata } from "@/services/setUserEntityLink";
import Callout from "@/components/Callout";
import EnvelopeInfo from "../EnvelopeInfo";

interface EnvelopeListSectionProps {
    envelopes: IEnvelopeFromList[]
    error: string | null
    linkedUser: UserEntityMetadata | null
    theme: DeskproTheme
    navigate: NavigateFunction
    isSandboxAccount: boolean
}

export default function EnvelopeListSection(props: Readonly<EnvelopeListSectionProps>): JSX.Element {
    const { envelopes, error, linkedUser, theme, navigate, isSandboxAccount } = props

    {/* Show the error callout if an error occurs while fetching. */ }
    if (error) {
        return (
            <Stack style={{ width: "100%" }} padding={12}>
                <Callout
                    accent="red"
                    style={{ width: "100%" }}
                >
                    {error}
                </Callout>
            </Stack>
        )
    }

    // Navigate to the link page if no linked user is found.
    // This should never happen as the Deskpro user should be the
    // fallback if the is no linked entity. 

    // This is covering the case where something weird happens.
    if (!linkedUser) {
        navigate("/users/link")
        return <></>
    }

    // Show message if there are no envelopes for the provided email.
    if (envelopes.length < 1) {
        return (
            <Stack padding={12}>
                <em style={{
                    color: theme.colors.grey80,
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    fontSize: "12px"
                }}>
                    No Envelopes Found For {linkedUser.email}
                </em>
            </Stack>
        )
    }

    // Show the envelopes as usual if all is well.
    return (
        <Stack vertical padding={12} gap={5} style={{ width: "100%" }}>
            <H1>Envelopes ({envelopes.length})</H1>
            <Stack vertical gap={20} style={{ width: "100%" }}>
                {envelopes?.map((envelope, index) => (
                    <Fragment key={envelope.envelopeId}>
                        <EnvelopeInfo
                            key={envelope.envelopeId}
                            envelope={envelope}
                            theme={theme}
                            isSandboxAccount={isSandboxAccount}
                        />

                        {index + 1 !== envelopes.length && <HorizontalDivider style={{ width: "100%" }} />}
                    </Fragment>
                ))}
            </Stack>
        </Stack>
    )
}