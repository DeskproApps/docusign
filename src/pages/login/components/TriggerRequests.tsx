import Callout from "@/components/Callout";
import { P2 } from "@deskpro/deskpro-ui";

export interface TriggeredRequest {
    isLoading: boolean
    success: boolean
}

interface TriggerRequestsProps {
    request: TriggeredRequest | null
}
export default function TriggerRequests(props: Readonly<TriggerRequestsProps>) {
    const { request } = props

    const successMessage = `20 requests have been triggered. You should now be able to 
    submit your app for review from your Docusign developer account.`
    const errorMessage = "Error while triggering 20 requests. Please try again."

    if (!request) {
        return null
    }

    if (request.isLoading) {
        return (<P2>Triggering requests, this may take a few moments to complete...</P2>)
    }

    return (
        <Callout
            style={{ width: "100%" }}
            accent={request.success ? "cyan" : "red"}>
            {request.success ? successMessage : errorMessage}
        </Callout>
    )
}