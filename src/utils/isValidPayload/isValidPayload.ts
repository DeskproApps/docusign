
type Payload =
    { type: "changePath", path?: string }
    | { type: "logout" }
    | { type: "unlink", email?: string }


export default function isValidPayload(payload: unknown): payload is Payload {
    if (payload && typeof payload === 'object' && 'type' in payload) {
        return true
    }
    return false
}