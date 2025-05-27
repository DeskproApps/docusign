import { DeskproTheme, H3, P5, P8, Stack } from "@deskpro/deskpro-ui";
import { IEnvelopeFromList } from "@/api/types";
import { ExternalIconLink, PropertyRow } from "@deskpro/app-sdk";
import { DocusignLogo } from "@/components/DocusignLogo/DocusignLogo";
import resolveSubdomain from "@/utils/resolveSubdomain";

interface EnvelopeInfoProps {
    envelope: IEnvelopeFromList
    theme: DeskproTheme
    isSandboxAccount: boolean
}

export default function EnvelopeInfo(props: Readonly<EnvelopeInfoProps>): JSX.Element {
    const { envelope, theme, isSandboxAccount } = props

    const recipients = extractRecipients(envelope.recipients)
    const paragraphTheme = theme.colors.grey80
      const subdomain = resolveSubdomain("web-app", isSandboxAccount)
    

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
                <ExternalIconLink
                    href={`https://${subdomain}.docusign.com/send/documents/details/${envelope.envelopeId}`}
                    icon={<DocusignLogo />}
                />
            </Stack>

            {/* Envelope metadata. */}
            <Stack vertical style={{ width: "100%" }} gap={0}>
                <PropertyRow>
                    <Stack vertical>
                        <P8 style={{ color: paragraphTheme }}>
                            Recipient(s)
                        </P8>

                        {recipients.map((recipient) => {
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


function extractRecipients(recipients: IEnvelopeFromList["recipients"]): string[] {
    const mergedRecipients = [
        ...(recipients?.carbonCopies ?? []),
        ...(recipients?.signers ?? [])
    ]

    const uniqueNames = [...new Set(mergedRecipients.map(recipient => {
        return recipient.name
    }))]

    return uniqueNames
}