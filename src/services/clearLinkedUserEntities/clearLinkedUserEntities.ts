import { ENTITY_NAME } from "@/constants/general";
import { IDeskproClient } from "@deskpro/app-sdk";

/**
 *  Deletes all entity associations linked to the specified Deskpro user.
 * @param client - The Deskpro client.
 * @param userId - The id of the Deskpro user.
 */
export default async function clearLinkedUserEntities(client: IDeskproClient, userId: string): Promise<void> {
    const linkedEmails = await client.getEntityAssociation(ENTITY_NAME, userId).list()

    await Promise.all(linkedEmails.map(async (email) => {
        try {
            await client.getEntityAssociation(ENTITY_NAME, userId).delete(email)
        }
        catch {
            // eslint-disable-next-line no-console
            console.error("Error deleting association for: ", email, ".")
        }
    }))
}