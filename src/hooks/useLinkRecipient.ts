import {
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEnvelopesWithRecipients } from "../api/api";

export const useLinkRecipient = () => {
  const { context } = useDeskproLatestAppContext();
  const { client } = useDeskproAppClient();
  const [isLinking, setIsLinking] = useState(false);
  const navigate = useNavigate();

  const deskproUser = context?.data.user;

  const linkRecipient = useCallback(
    async (recipientEmail: string) => {
      if (!context || !recipientEmail || !client) return;

      setIsLinking(true);

      const deskproUser = context?.data.user;

      const getEntityAssociationData = (await client
        ?.getEntityAssociation("linkedDocuSignRecipient", deskproUser.id)
        .list()) as string[];

      if (getEntityAssociationData.length > 0) {
        await client
          ?.getEntityAssociation("linkedDocuSignRecipient", deskproUser.id)
          .delete(getEntityAssociationData[0]);
      }

      await client
        ?.getEntityAssociation("linkedDocuSignRecipient", deskproUser.id)
        .set(recipientEmail);

      navigate("/");

      setIsLinking(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [context, client]
  );

  const getEnvelopeIds = useCallback(async () => {
    if (!client || !deskproUser) return null;

    let linkedRecipient = (
      await client
        .getEntityAssociation("linkedDocuSignRecipient", deskproUser.id)
        .list()
    )[0];

    const userEmail = deskproUser.primaryEmail;

    if (!linkedRecipient) {
      await linkRecipient(userEmail);

      linkedRecipient = userEmail;
    }
    const envelopes = await getEnvelopesWithRecipients(client, linkedRecipient);

    return envelopes;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, deskproUser]);

  // const getRecipients = useCallback(async () => {
  //   if (!client) return;

  //   const envelopes = await getEnvelopesWithRecipients(client, linkedRecipient);
  // }, [client]);

  const unlinkRecipient = useCallback(async () => {
    if (!context || !client) return;

    (async () => {
      const id = (
        await client
          .getEntityAssociation("linkedDocuSignRecipient", deskproUser.id)
          .list()
      )[0];

      await client
        .getEntityAssociation("linkedDocuSignRecipient", deskproUser.id)
        .delete(id);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, context]);
  return {
    linkRecipient,
    isLinking,
    unlinkRecipient,
    getEnvelopeIds,
    context,
    client,
  };
};
