import { DocusignError, isErrorWithMessage } from "./baseRequest";

interface ParsedAuthError {
    type: "AUTH_ERROR" | "UNHANDLED_ERROR";
    message: string;
}

export default function parseAuthError(error: unknown): ParsedAuthError {
    if (error instanceof DocusignError && isErrorWithMessage(error.data)) {
        const { errorCode, message } = error.data;

        switch (errorCode) {
            case "AUTHORIZATION_INVALID_TOKEN":
            case "USER_AUTHENTICATION_FAILED":
            case "PARTNER_AUTHENTICATION_FAILED":
                return { type: "AUTH_ERROR", message }
            case "INVALID_REQUEST_PARAMETER":
                if (message.includes("accountId")) {
                    return { type: "AUTH_ERROR", message }
                }
                break
        }
    }

    if (error instanceof Error) {
         switch (error.message){
            case "Error refreshing access token":
                return { type: "AUTH_ERROR", message: error.message }
        }
    }

    return { type: "UNHANDLED_ERROR", message: "Unknown error format" }
}