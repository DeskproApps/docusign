import { IDeskproClient } from "@deskpro/app-sdk";
import getUserEnvelopes from "../getUserEnvelopes";
import triggerDelay from "@/utils/triggerDelay";

export default async function triggerRequests(client: IDeskproClient, requestCount = 20): Promise<boolean> {
    const delayBetweenRequests = 500 // MS

    for (let i = 0; i < requestCount; i++) {
        try {
            const response = await getUserEnvelopes(client, {
                userEmail: "",
                limit: 1
            })
            // REMOVE BEFORE PRODUCTION
            console.log(`Request ${i + 1} was successful:`, response)
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(`Request ${i + 1} failed:`, error)
            return false
        }

        // Add delay between calls to prevent rate limits
        if (i < requestCount - 1) {
            await triggerDelay(delayBetweenRequests)
        }
    }

    // REMOVE BEFORE PRODUCTION
    console.log(`All ${requestCount} requests completed successfully!`)
    return true
}
