import { getEnvelopeById, getEnvelopeListByEmail } from "../../../api";
import { IDeskproClient } from "@deskpro/app-sdk";
import { IEnvelope } from "../../../api/types";

export interface UserEnvelopes {
    user: {
        name: string
    },
    envelopes: IEnvelope[]
}

export default async function getUserEnvelopes(client: IDeskproClient, userEmail: string): Promise<UserEnvelopes | null> {
    // Get the metadata for the provided user and their envelopes
    const userMetadata = await getEnvelopeListByEmail(client, userEmail)

    if (!userMetadata) {
        return null
    }

    // Get more info for the all the envelopes
    const envelopes = await Promise.all(
        userMetadata.envelopeIds.map((envelopeId) => getEnvelopeById(client, envelopeId))
    )

    return {
        user: {
            name: userMetadata.name
        },
        envelopes
    }

}