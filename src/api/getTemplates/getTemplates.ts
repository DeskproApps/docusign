import { IDeskproClient } from "@deskpro/app-sdk"
import { IEnvelopeTemplate } from "../types"
import { baseRequest } from "../baseRequest"

export default async function getTemplates(client: IDeskproClient) {
    return await baseRequest<{ envelopeTemplates: IEnvelopeTemplate[] }>(client, { endpoint: "templates", method: "GET"})
}