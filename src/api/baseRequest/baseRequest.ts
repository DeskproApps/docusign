import { ACCESS_TOKEN_PATH, ACCOUNT_BASE_URL_PATH, ACCOUNT_ID_PATH } from "@/constants/auth";
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

    const isSandboxAccount = (await client.getUserState<boolean>("isSandboxAccount"))[0]?.data ?? false
    const isUsingGlobalProxy = (await client.getUserState<boolean>("isUsingGlobalProxy"))[0]?.data ?? false
    
    const baseURL = `[user[${ACCOUNT_BASE_URL_PATH}]]/restapi/v2.1/accounts/[user[${ACCOUNT_ID_PATH}]]`
    const requestURL = `${baseURL}/${endpoint}`

    const dpFetch = await proxyFetch(client)

    async function makeRequest(): Promise<Response> {
        const options: RequestInit = {
            method,
            headers: {
                Authorization: `Bearer [user[${ACCESS_TOKEN_PATH}]]`,
                "Content-Type": "application/json",
            },
        }

        if (data) {
            options.body = JSON.stringify(data)
        }

        return await dpFetch(requestURL, options)
    }

    let response = await makeRequest()

    // We cannot refresh the access token if we are using the global proxy
    // because the integration key and secret key are not available.
    if ([401, 403].includes(response.status) && !isUsingGlobalProxy) {
        try {
            await refreshAccessToken(client, isSandboxAccount)
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

    return await response.json() as T
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
    errorCode?: string
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
