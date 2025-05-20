import { getTemplates } from "@/api";
import { useQueryWithClient } from "@deskpro/app-sdk";

export default function useEnvelopeTemplates() {
    const templatesQuery = useQueryWithClient(
        ["templates"],
        async (client) => {
            return await getTemplates(client)
        }
    )

    return {
        templates: templatesQuery.data?.envelopeTemplates ?? [],
        isLoading: templatesQuery.isLoading
    }
}