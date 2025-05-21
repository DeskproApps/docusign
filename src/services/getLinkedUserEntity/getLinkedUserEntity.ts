import { ENTITY_NAME } from "@/constants/general";
import { IDeskproClient } from "@deskpro/app-sdk";
import { UserEntityMetadata } from "../setUserEntityLink/setUserEntityLink";

interface GetLinkedUserEntityParams {
    userId: string
}

export default async function getLinkedUserEntity(client: IDeskproClient, params: GetLinkedUserEntityParams) {
    const { userId} = params

    const linkedEmails = await client.getEntityAssociation(ENTITY_NAME, userId).list()
    const firstEmail= linkedEmails[0]

    return await client.getEntityAssociation(ENTITY_NAME, userId).get<UserEntityMetadata | null>(firstEmail ?? "")
}