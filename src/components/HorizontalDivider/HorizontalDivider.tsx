import { HorizontalDivider as HorizontalDividerSDK } from "@deskpro/app-sdk";

export const HorizontalDivider = ({
  backgroundColor,
}: {
  backgroundColor?: string;
}) => {
  return (
    <HorizontalDividerSDK
      style={{
        width: "110%",
        marginBottom: "10px",
        marginLeft: "-10px",
        backgroundColor,
      }}
    />
  );
};
