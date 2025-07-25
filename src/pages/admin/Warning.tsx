import { useDeskproAppTheme } from "@deskpro/app-sdk";
import { H1, P5, Stack } from "@deskpro/deskpro-ui";
import { useEffect } from "react";

export const Warning = () => {
  const { theme } = useDeskproAppTheme();

  useEffect(() => {
    document.body.style.margin = "0px";
  }, []);

  return (
    <Stack vertical gap={5}>
      <H1 style={{ color: theme.colors.red60 }}>Warning</H1>
      <P5>
        Please be advised that in order to use the Docusign app for production accounts, you will be
        required to submit a review of the app on their website. We cannot
        guarantee how long it may take for your review to be processed. For more
        information, please refer to our setup guide.{" "}
      </P5>
    </Stack>
  );
};
