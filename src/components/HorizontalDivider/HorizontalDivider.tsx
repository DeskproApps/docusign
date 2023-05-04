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
        marginLeft: "-10px",
        backgroundColor,
      }}
    />
  );
};
