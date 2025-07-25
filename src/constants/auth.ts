export const ACCOUNT_ID_PATH = `oauth2/account_id`
export const ACCOUNT_BASE_URL_PATH = `oauth2/base_uri`
export const ACCESS_TOKEN_PATH = "oauth2/access_token"
export const REFRESH_TOKEN_PATH = "oauth2/refresh_token"

export const SCOPES = [
    "extended",
    "signature",
    "click.manage",
    "openid",
    "click.send",
    "user_read",
    "account_read",
    "user_write",
    "organization_read",
    "domain_read"
] as const

export const GLOBAL_PROXY_INTEGRATION_KEY = "dfc15575-9c12-48f1-a273-c2d034e4ed01"