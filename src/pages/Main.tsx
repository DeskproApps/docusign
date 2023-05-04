import {
  Button,
  H1,
  H3,
  LoadingSpinner,
  Stack,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
  useQueryWithClient,
} from "@deskpro/app-sdk";
import { useNavigate } from "react-router-dom";
import { useLinkRecipient } from "../hooks/useLinkRecipient";
import { FieldMapping } from "../components/FieldMapping/FieldMapping";
import envelopeJson from "../mapping/envelope.json";
import { promiseAllEnvelopes } from "../utils/utils";
import { HorizontalDivider } from "../components/HorizontalDivider/HorizontalDivider";

export const Main = () => {
  const navigate = useNavigate();

  const { unlinkRecipient, context, getEnvelopeIds } = useLinkRecipient();

  useInitialisedDeskproAppClient((client) => {
    client.registerElement("docusignRefresh", {
      type: "refresh_button",
    });

    client.registerElement("docuSignMenuButton", {
      type: "menu",
      items: [
        {
          title: "Unlink contact",
          payload: {
            type: "changePage",
            page: "/",
          },
        },
      ],
    });
  });

  const envelopesIdsWithRecipient = useQueryWithClient(
    ["contactIds", context?.data.user.primaryEmail ?? ""],
    getEnvelopeIds,
    {
      enabled: !!context?.data.user.primaryEmail,
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
        case "docuSignMenuButton":
          await unlinkRecipient();
          navigate("/search");

          return;
        case "docuSignHomeButton":
          navigate("/redirect");
      }
    },
  });

  const envelopes = envelopesQuery.data;

  if (!envelopesIdsWithRecipient.isLoading && !envelopesIdsWithRecipient.data) {
    navigate("/search");
  } else if (
    !envelopesIdsWithRecipient.isLoading &&
    envelopesIdsWithRecipient.data?.envelopeIds.length === 0
  ) {
    return <H1>No data was found.</H1>;
  } else if (envelopesIdsWithRecipient.isLoading || envelopesQuery.isLoading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <Stack vertical gap={5}>
      <Stack vertical gap={3} style={{ width: "100%" }}>
        <Button
          text="Send Template"
          onClick={() =>
            navigate(
              `sendtemplate?email=${encodeURIComponent(
                envelopesIdsWithRecipient.data?.email ?? ""
              )}`
            )
          }
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
