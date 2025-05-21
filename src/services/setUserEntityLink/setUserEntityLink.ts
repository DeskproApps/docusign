import { ENTITY_NAME } from "@/constants/general";
import { IDeskproClient } from "@deskpro/app-sdk";

export interface UserEntityMetadata{
    name?: string
    email: string
    id: string 
}
interface SetUserEntityLinkParams {
    userId: string
    email: string
    metadata: UserEntityMetadata
}

export default async function setUserEntityLink(client: IDeskproClient, params: SetUserEntityLinkParams){
    const { userId, email, metadata } = params

    await client
        .getEntityAssociation(ENTITY_NAME, userId)
        .set<UserEntityMetadata>(email, metadata)
}