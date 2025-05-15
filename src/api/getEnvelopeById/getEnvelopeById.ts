import { baseRequest } from "../baseRequest";
import { IDeskproClient } from "@deskpro/app-sdk";
import { IEnvelope } from "../types";

export default async function getEnvelopeById(client: IDeskproClient, envelopeId: string): Promise<IEnvelope> {
    return baseRequest(
        client,
        { method: "GET", endpoint: `envelopes/${envelopeId}` },

    )
}
