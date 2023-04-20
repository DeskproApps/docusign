import {
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLinkContact } from "../hooks/useLinkContact";

export const Main = () => {
  const navigate = useNavigate();
  const [contactId, setContactId] = useState<string | null>(null);
  const { unlinkContact, context, client, getContactId } = useLinkContact();
  contactId;
  useInitialisedDeskproAppClient((client) => {
    client.registerElement("docusignRefresh", {
      type: "refresh_button",
    });

    client.registerElement("docusignMenuButton", {
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

  useEffect(() => {
    if (!context || !client) return;

    (async () => {
      const getLinkedContactId = await getContactId();
      console.log(getLinkedContactId);
      if (!getLinkedContactId) {
        navigate("/search");

        return;
      }

      setContactId(getLinkedContactId as string);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, client]);

  useDeskproAppEvents({
    async onElementEvent(id) {
      switch (id) {
        case "docuSignMenuButton":
          await unlinkContact();

          navigate("/search");

          return;
        case "docuSignHomeButton":
          navigate("/redirect");
      }
    },
  });

  return <h1>a</h1>;
};
