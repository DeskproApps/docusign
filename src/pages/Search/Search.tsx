import {
  Button,
  Input,
  P1,
  Radio,
  Spinner,
  Stack,
  useDeskproAppTheme,
  useInitialisedDeskproAppClient,
  useQueryWithClient,
} from "@deskpro/app-sdk";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useState } from "react";
import { getRecipients } from "../../api/api";
import useDebounce from "../../hooks/useDebounce";
import { useLinkRecipient } from "../../hooks/useLinkRecipient";
import { HorizontalDivider } from "../../components/HorizontalDivider/HorizontalDivider";
import { IEnvelopeWithRecipients } from "../../api/types";
import { parseArray } from "../../utils/utils";

export const Search = () => {
  const { theme } = useDeskproAppTheme();
  const { linkRecipient, isLinking } = useLinkRecipient();
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(
    null
  );
  const [inputText, setInputText] = useState<string>("");
  const { debouncedValue: deboundedText } = useDebounce(inputText, 300);

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Find recipient");
  });

  const recipientsQuery = useQueryWithClient(["recipients"], (client) =>
    getRecipients(client)
  );

  const recipients = useMemo(
    () =>
      (parseArray(recipientsQuery.data) as IEnvelopeWithRecipients[])?.filter(
        (e) =>
          deboundedText.length > 1
            ? [e.email.toLowerCase(), e.name.toLowerCase()].some(
                (e) => e.indexOf(deboundedText.toLowerCase()) > -1
              )
            : true
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [recipientsQuery.isSuccess, deboundedText]
  );

  return (
    <Stack vertical>
      <Input
        onChange={(e) => setInputText(e.target.value)}
        value={inputText}
        placeholder="Enter item details"
        type="text"
        data-testid="search-input"
        leftIcon={faMagnifyingGlass}
      />
      {recipientsQuery.isFetching ? (
        <Stack style={{ margin: "auto", marginTop: "20px" }}>
          <Spinner size="extra-large" />
        </Stack>
      ) : (
        <Stack vertical style={{ width: "100%", marginTop: "6px" }}>
          <Stack
            vertical
            style={{ width: "100%", justifyContent: "space-between" }}
            gap={2}
          >
            <Button
              onClick={() =>
                selectedRecipient && linkRecipient(selectedRecipient)
              }
              disabled={isLinking}
              text="Link Recipient"
            ></Button>
            <HorizontalDivider />
          </Stack>
          <Stack vertical style={{ width: "100%" }} gap={8}>
            {recipients?.map((recipient, i: number) => (
              <div style={{ width: "100%" }} key={i}>
                <Stack style={{ justifyContent: "space-between" }}>
                  <Stack justify="start" key={i} gap={5} align="start">
                    <Radio
                      checked={selectedRecipient === recipient.email}
                      onChange={() => setSelectedRecipient(recipient.email)}
                      style={{ marginTop: "4px" }}
                    />
                    <Stack vertical style={{ overflow: "hidden" }}>
                      <P1
                        style={{
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {recipient.name}
                      </P1>
                      <P1
                        style={{
                          color: theme.colors.grey80,
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {recipient.email}
                      </P1>
                    </Stack>
                  </Stack>
                </Stack>
              </div>
            ))}
            <HorizontalDivider backgroundColor={theme.colors.grey10} />
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
