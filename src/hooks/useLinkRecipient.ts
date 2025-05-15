import {
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { useCallback } from "react";
import { getEnvelopesWithRecipients } from "@/api/api";

export const useLinkRecipient = () => {
  const { context } = useDeskproLatestAppContext<{
    user: {
      firstName: string;
      lastName: string;
      primaryEmail: string;
    }
  }, unknown>();
  const { client } = useDeskproAppClient();

  const deskproUser = context?.data?.user;

  const getEnvelopeIds = useCallback(async () => {
    if (!client || !deskproUser) return null;

    const userEmail = deskproUser.primaryEmail;

    const envelopes = await getEnvelopesWithRecipients(client, userEmail);

    return envelopes;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, deskproUser]);

  return {
    getEnvelopeIds,
    context,
    client,
  };
};
