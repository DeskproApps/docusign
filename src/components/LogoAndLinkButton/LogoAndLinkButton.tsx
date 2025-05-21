import { ExternalIconLink } from "@deskpro/app-sdk";
import { DocusignLogo } from "../DocusignLogo/DocusignLogo";

export const LogoAndLinkButton = ({ endpoint }: { endpoint: string }) => {
  return (
    <ExternalIconLink
      href={`https://app.docusign.com${endpoint}`}
      icon={<DocusignLogo />}
    ></ExternalIconLink>
  );
};
