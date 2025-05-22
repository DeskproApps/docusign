import { Button, P8, Stack } from "@deskpro/deskpro-ui";
import { HorizontalDivider, Search, useDeskproAppTheme, useDeskproElements, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { SEARCH_QUERY_MIN_LENGTH } from "@/api/getUsersByQuery";
import { useState } from "react";
import Required from "@/components/forms/Required";
import useDebounce from "@/hooks/useDebounce";
import useDocusignUsers from "./hooks/useDocusignUsers";
import UserList from "./components/UserList";

export default function LinkUserPage() {
    useInitialisedDeskproAppClient((client) => {
        client.setTitle("Link User")
    }, [])

    useDeskproElements(({ clearElements, registerElement, deRegisterElement }) => {
        clearElements()
        deRegisterElement("menu")
        // Should return the agent to the envelope list page with the linked user
        // being the Deskpro user [unless something weird happens].
        registerElement("home", {
            type: "home_button",
            payload: { type: "changePath", path: "/envelopes/list" },
        })
        registerElement("refresh", { type: "refresh_button" })
    }, [])
    const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined)

    const [searchTerm, setSearchTerm] = useState("")
    const { debouncedValue: debouncedSearchTerm } = useDebounce(searchTerm, 500)

    const { theme } = useDeskproAppTheme()
    const { users, isLoading, onLinkUser, isLinking } = useDocusignUsers(debouncedSearchTerm, selectedUserId)
    const isValidSearchLength = debouncedSearchTerm.length >= SEARCH_QUERY_MIN_LENGTH

    return (
        <Stack vertical style={{ width: "100%" }}>
            <Stack vertical padding={12} gap={5}>
                <label htmlFor="searchInput">
                    <P8 style={{ color: theme?.colors?.grey80 }}>
                        Name or email address <Required />
                    </P8>
                </label>
                <Search
                    marginBottom={0}
                    onChange={(search) => {
                        setSearchTerm(search)
                    }}
                    inputProps={{
                        id: "searchInput",
                        placeholder: `Enter at least ${SEARCH_QUERY_MIN_LENGTH} characters`
                    }}
                />

                <Stack style={{ width: "100%" }} justify="space-between" gap={6}>
                    <Button
                        type="button"
                        text="Link"
                        disabled={!isValidSearchLength || isLinking}
                        loading={isLinking}
                        onClick={onLinkUser}
                    />
                </Stack>
            </Stack>

            <HorizontalDivider style={{ width: "100%" }} />

            <UserList
                theme={theme}
                selectedUserId={selectedUserId}
                setSelectedUserId={setSelectedUserId}
                isLoading={isLoading}
                isValidSearchLength={isValidSearchLength}
                users={users}
            />
        </Stack>
    )
}