import { DeskproTheme, H3, P5, P8, Stack } from "@deskpro/deskpro-ui";
import { IEnvelopeFromList } from "@/api/types";
import { LogoAndLinkButton } from "@/components/LogoAndLinkButton/LogoAndLinkButton";
import { PropertyRow } from "@deskpro/app-sdk";

interface EnvelopeInfoProps {
    envelope: IEnvelopeFromList
    theme: DeskproTheme
}

export default function EnvelopeInfo(props: Readonly<EnvelopeInfoProps>): JSX.Element {
    const { envelope, theme } = props

    const recipients = extractRecipients(envelope.recipients)
    const paragraphTheme = theme.colors.grey80

    return (
        <Stack vertical style={{ width: "100%" }} gap={5} key={envelope.envelopeId}>
            {/* Title and external link. */}
            <Stack
                style={{
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "flex-end",
                }}
            >
                <H3 style={{ lineHeight: "18px" }}>{envelope.emailSubject}</H3>
                <LogoAndLinkButton endpoint={`/documents/details/${envelope.envelopeId}`} />
            </Stack>

            {/* Envelope metadata. */}
            <Stack vertical style={{ width: "100%" }} gap={0}>
                <PropertyRow>
                    <Stack vertical>
                        <P8 style={{ color: paragraphTheme }}>
                            Recipient(s)
                        </P8>

                        {recipients.map((recipient)=>{
                            return (
                                // Yes, each recipient is unique.
                                <P5 key={recipient}>{recipient}</P5>
                            )
                        })}
                    </Stack>

                    <Stack vertical>
                        <P8 style={{ color: paragraphTheme }}>
                            Status
                        </P8>
                        <P5 style={{ textTransform: "capitalize" }}>{envelope.status}</P5>
                    </Stack>
                </PropertyRow>

                <Stack vertical>
                    <P8 style={{ color: paragraphTheme }}>
                        Last change date
                    </P8>
                    <P5 style={{ textTransform: "capitalize" }}>
                        {formatDate(new Date(envelope.lastModifiedDateTime))}</P5>
                </Stack>
            </Stack>
        </Stack>
    )
}

function formatDate(date: Date) {
    const day = date.getDate()
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const month = monthNames[date.getMonth()]
    const year = date.getFullYear()

    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${day} ${month} ${year} ${hours}:${minutes}`
}


function extractRecipients(recipients: IEnvelopeFromList["recipients"]): string[]{
    const mergedRecipients = [
        ...(recipients?.carbonCopies ?? []),
        ...(recipients?.signers ?? [])
    ]

    const uniqueNames = [...new Set(mergedRecipients.map(recipient => {
        return recipient.name
    }))]

    return uniqueNames
}