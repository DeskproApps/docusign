import { faExclamationTriangle, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { Stack, Button } from "@deskpro/deskpro-ui";
import Callout from "@/components/Callout";
import { DocusignError, isErrorWithMessage } from "@/api/baseRequest";

interface ErrorFallbackProps {
  error: unknown
  resetErrorBoundary: () => void
}

export default function ErrorFallback(props: Readonly<ErrorFallbackProps>) {
  const { error, resetErrorBoundary } = props
  let errorMessage = "Unknown Error"

  if (error instanceof DocusignError && isErrorWithMessage(error.data)) {
    errorMessage = error.data.message
  } else if (error instanceof Error) {
    errorMessage = error.message
  }

  return (
    <Stack style={{ width: "100%" }} vertical gap={10} padding={12} role="alert">
      <Callout
        accent="red"
        headingText={"Something went wrong"}
        icon={faExclamationTriangle}
        style={{ width: "100%" }}
      >
        {errorMessage}
      </Callout>
      <Button
        text="Reload"
        onClick={resetErrorBoundary}
        icon={faRefresh}
        intent="secondary"
      />
    </Stack>
  );
};
