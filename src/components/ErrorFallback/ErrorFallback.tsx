import { Stack, H1, H2, Button } from "@deskpro/app-sdk";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";

export const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => {
  return (
    <Stack vertical gap={10} role="alert">
      <H1>Something went wrong:</H1>
      <H2>{error.message}</H2>
      <Button
        text="Reload"
        onClick={resetErrorBoundary}
        icon={faRefresh}
        intent="secondary"
      />
    </Stack>
  );
};
