export type ContextData = {
    app: {
        description: string
        id: string
        instanceId: string
        name: string
        title: string
    },
    currentAgent: {
        id: string
        firstName: string
        lastName: string
        primaryEmail: string
        locale: string
        emails: string[]
        isAdmin: boolean
        isAgent: boolean
        isUser: boolean
    },
    user: {
        id: string
        name: string
        firstName: string
        lastName: string
        titlePrefix: string
        isDisabled: boolean
        isAgent: boolean
        isConfirmed: boolean
        emails: string[]
        primaryEmail: string
        customFields: Record<string, unknown>
        language: string
        locale: string
    }
    env: {
        envId: string
        release?: string
        releaseBuildTime: number
        isCloud?: boolean
        isDemo?: boolean
        trialDaysLeft?: number
    }
}

export interface ContextSettings {
    integration_key?: string
    use_advanced_connect?: boolean,
    use_sandbox_account?: boolean,
}