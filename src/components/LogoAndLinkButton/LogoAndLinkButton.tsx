import { ExternalIconLink } from "@deskpro/app-sdk";
import { DocuSignLogo } from "../DocuSignLogo/DocuSignLogo";

export const LogoAndLinkButton = ({ endpoint }: { endpoint: string }) => {
  return (
    <ExternalIconLink
      href={`https://app.docusign.com${endpoint}`}
      icon={<DocuSignLogo />}
    ></ExternalIconLink>
  );
};
