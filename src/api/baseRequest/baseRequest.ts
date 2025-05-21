import { ACCESS_TOKEN as ACCESS_TOKEN_PLACEHOLDER, ACCOUNT_ID } from "@/utils/consts";
import { IDeskproClient, proxyFetch } from "@deskpro/app-sdk";
import { RequestMethod } from "@/api/types";
import refreshAccessToken from "./refreshAccessToken";

interface BaseRequestParams {
    endpoint: string,
    method: RequestMethod,
    data?: unknown
}

/**
 * Wrapper fetch function for requests to the Docusign API.
 *
 * @template T - The type of the response data.
 * 
 * @throws {DocusignError} If the HTTP status code indicates a failed request (not 2xx or 3xx).
 */
export default async function baseRequest<T = unknown>(client: IDeskproClient, params: BaseRequestParams) {

    const { endpoint, method, data } = params

    const baseURL = `https://demo.docusign.net/restapi/v2.1/accounts/${ACCOUNT_ID}/`
    const requestURL = `${baseURL}/${endpoint}`

    const dpFetch = await proxyFetch(client)

    async function makeRequest(): Promise<Response> {
        const options: RequestInit = {
            method,
            headers: {
                Authorization: ACCESS_TOKEN_PLACEHOLDER,
                "Content-Type": "application/json",
            },
        }

        if (data) {
            options.body = JSON.stringify(data)
        }

        return await dpFetch(requestURL, options)
    }

    let response = await makeRequest()

    if ([401, 403].includes(response.status)) {
        try {
            await refreshAccessToken(client)
            response = await makeRequest()
        } catch (err) {
            throw new DocusignError("Error refreshing access token", { statusCode: response.status })
        }
    }

    if (isResponseError(response)) {
        let errorData: unknown
        const rawText = await response.text()

        try {
            errorData = JSON.parse(rawText)
        } catch {
            errorData = { message: "Non-JSON error response received", raw: rawText }
        }

        throw new DocusignError("API Request Failed", { statusCode: response.status, data: errorData })

    }

    return response.json() as T
}

export type DocusignErrorPayload = {
    statusCode: number
    data?: unknown
}

export class DocusignError extends Error {
    data: DocusignErrorPayload["data"]
    statusCode: DocusignErrorPayload["statusCode"]

    constructor(message: string, payload: DocusignErrorPayload) {
        super(message)
        this.name = "DocusignError"
        this.data = payload.data
        this.statusCode = payload.statusCode
    }
}
interface DocusignErrorData {
    message: string
}

export function isErrorWithMessage(data: unknown): data is DocusignErrorData {
    if (data && typeof data === 'object' && 'message' in data && typeof data.message === "string") {
        return true
    }

    return false
}

function isResponseError(response: Response): boolean {
    return response.status < 200 || response.status >= 400
}
