type SubdomainTarget = "account" | "web-app" 

export default function resolveSubdomain(target: "account", isSandboxAccount: boolean): "account" | "account-d"
export default function resolveSubdomain(target: "web-app", isSandboxAccount: boolean): "apps" | "apps-d"

/**
 * Resolves the appropriate subdomain based on the environment and the target service.
 *
 * @example
 * resolveSubdomain("account", true) // returns "account-d"
 * resolveSubdomain("account", false) // returns "account"
 */
export default function resolveSubdomain(target: SubdomainTarget, isSandboxAccount: boolean) {

    switch (target) {
        // Mostly used for OAuth and other account related requests.
        case "account":
            return isSandboxAccount ? "account-d" : "account"
        // For links to the Docusign web app.
        case "web-app":
            return isSandboxAccount ? "apps-d" : "apps"
        default:
            return "unknown-target"
    }
}