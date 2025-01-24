import {
  LoadingSpinner,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
  useQueryWithClient,
} from "@deskpro/app-sdk";
import {
  Button,
  H1,
  H3,
  P5,
  Stack,
} from "@deskpro/deskpro-ui";
import { useNavigate } from "react-router-dom";
import { useLinkRecipient } from "../hooks/useLinkRecipient";
import { FieldMapping } from "../components/FieldMapping/FieldMapping";
import envelopeJson from "../mapping/envelope.json";
import { promiseAllEnvelopes } from "../utils/utils";
import { HorizontalDivider } from "../components/HorizontalDivider/HorizontalDivider";

export const Main = () => {
  const navigate = useNavigate();

  const { context, getEnvelopeIds } = useLinkRecipient();

  useInitialisedDeskproAppClient((client) => {
    client.registerElement("docusignRefresh", {
      type: "refresh_button",
    });
  });

  const envelopesIdsWithRecipient = useQueryWithClient(
    ["contactIds", context?.toString() ?? ""],
    getEnvelopeIds,
    {
      enabled: !!context,
    }
  );

  const envelopesQuery = useQueryWithClient(
    ["envelopes", ...(envelopesIdsWithRecipient.data?.envelopeIds ?? [])],
    (client) => promiseAllEnvelopes(client, envelopesIdsWithRecipient.data),
    {
      enabled: !!envelopesIdsWithRecipient.data?.envelopeIds?.length,
    }
  );

  useDeskproAppEvents({
    async onElementEvent(id) {
      switch (id) {
        case "docuSignHomeButton":
          navigate("/redirect");
      }
    },
  });

  const envelopes = envelopesQuery.data;

  if (
    envelopesIdsWithRecipient.isFetched &&
    (!envelopesIdsWithRecipient.data?.envelopeIds?.length ||
      !envelopesIdsWithRecipient.data)
  ) {
    return <P5>No envelopes found under this recipient</P5>;
  } else if (envelopesIdsWithRecipient.isLoading || envelopesQuery.isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <Stack vertical gap={5}>
      <Stack vertical gap={8} style={{ width: "100%" }}>
        <Button
          text="Create envelope"
          intent="secondary"
          onClick={() => navigate(`createEnvelope/file`)}
        ></Button>
        <Button
          text="Send existing Template"
          intent="secondary"
          onClick={() => navigate(`createEnvelope/template`)}
        ></Button>
        <HorizontalDivider />
      </Stack>
      {envelopes && (
        <Stack vertical gap={5} style={{ width: "100%" }}>
          <H1>Envelopes ({envelopes.length})</H1>
          <Stack vertical gap={5} style={{ width: "100%" }}>
            <FieldMapping
              childTitleAccessor={(field) => (
                <H3 style={{ lineHeight: "18px" }}>{field.emailSubject}</H3>
              )}
              idKey={envelopeJson.idKey}
              externalChildUrl={envelopeJson.externalUrl}
              fields={envelopes
                .map((e) => ({
                  ...e,
                  recipient: envelopesIdsWithRecipient.data?.name,
                }))
                .sort(
                  (a, b) =>
                    new Date(b.lastModifiedDateTime).getTime() -
                    new Date(a.lastModifiedDateTime).getTime()
                )}
              metadata={envelopeJson.main}
            />
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
