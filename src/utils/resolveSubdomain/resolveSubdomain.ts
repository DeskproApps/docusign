type SubdomainTarget = "account" | "web-app" | "general-api"

export default function resolveSubdomain(target: "account", isSandboxAccount: boolean): "account" | "account-d"
export default function resolveSubdomain(target: "web-app", isSandboxAccount: boolean): "apps" | "apps-d"
export default function resolveSubdomain(target: "general-api", isSandboxAccount: boolean): "www" | "demo"

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
        // General Docusign API.
        case "general-api":
            return isSandboxAccount ? "demo" : "www"
        default:
            return "unknown-target"
    }
}