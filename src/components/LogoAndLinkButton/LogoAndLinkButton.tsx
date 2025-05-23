import { DocusignLogo } from "../DocusignLogo/DocusignLogo";
import { ExternalIconLink } from "@deskpro/app-sdk";
import resolveSubdomain from "@/utils/resolveSubdomain";

interface LogoAndLinkButtonProps {
  endpoint: string
  isSandboxAccount: boolean
}

export default function LogoAndLinkButton(props: Readonly<LogoAndLinkButtonProps>) {
  const { endpoint, isSandboxAccount } = props

  const subdomain = resolveSubdomain("web-app", isSandboxAccount)
  return (
    <ExternalIconLink
      href={`https://${subdomain}.docusign.com${endpoint}`}
      icon={<DocusignLogo />}
    />
  )
}
