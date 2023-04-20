import {
  Button,
  Input,
  Label,
  Radio,
  Spinner,
  Stack,
  useInitialisedDeskproAppClient,
  useQueryWithClient,
} from "@deskpro/app-sdk";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { getContactsByQuery } from "../../api/api";
import useDebounce from "../../hooks/useDebounce";
import { useLinkContact } from "../../hooks/useLinkContact";
import { HorizontalDivider } from "../../components/HorizontalDivider/HorizontalDivider";

export const Search = () => {
  const { linkContact, isLinking } = useLinkContact();
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [inputText, setInputText] = useState<string>("");
  const { debouncedValue: deboundedText } = useDebounce(inputText, 300);

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Find Contact");
  });

  const contactsQuery = useQueryWithClient(
    ["contacts"],
    (client) => getContactsByQuery(client, deboundedText),
    {
      enabled: deboundedText.length > 0,
    }
  );

  const contacts = contactsQuery.data;

  return (
    <Stack>
      <Input
        onChange={(e) => setInputText(e.target.value)}
        value={inputText}
        placeholder="Enter item details"
        type="text"
        leftIcon={faMagnifyingGlass}
      />
      {contactsQuery.isLoading ? (
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
              onClick={() => selectedContact && linkContact(selectedContact)}
              disabled={isLinking}
              text="Link Contact"
            ></Button>
            <HorizontalDivider />
          </Stack>
          <Stack vertical style={{ width: "100%" }}>
            {contacts.data?.Contacts?.map((contact: any, i: number) => (
              <div style={{ width: "100%" }} key={i}>
                <Stack style={{ justifyContent: "space-between" }}>
                  <Stack vertical justify="start" key={i}>
                    <Radio
                      label={contact.Name}
                      style={{ color: "#3A8DDE" }}
                      checked={selectedContact === contact.ContactID}
                      onChange={() => setSelectedContact(contact.ContactID)}
                    />
                    <Stack>
                      <Label
                        style={{ marginLeft: "20px" }}
                        label={contact.EmailAddress || "No email address"}
                      ></Label>
                    </Stack>
                  </Stack>
                </Stack>
                <HorizontalDivider />
              </div>
            ))}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
