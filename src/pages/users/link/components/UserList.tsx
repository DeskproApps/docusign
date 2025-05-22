import { Checkbox, DeskproTheme, P5, P6, Stack } from "@deskpro/deskpro-ui"
import { UseDocusignUsersReturn } from "../hooks/useDocusignUsers"
import { LoadingSpinner } from "@deskpro/app-sdk"

interface UserListProps {
    isLoading: boolean
    isValidSearchLength: boolean
    selectedUserId: string | undefined
    setSelectedUserId: React.Dispatch<React.SetStateAction<string | undefined>>
    theme: DeskproTheme
    users: UseDocusignUsersReturn["users"]
}

export default function UserList(props: Readonly<UserListProps>): JSX.Element {
    const { theme, isLoading, isValidSearchLength, users, selectedUserId, setSelectedUserId } = props

    {/* Show loading spinner when fetching users. */ }
    if (isLoading) {
        return (
            <Stack align="center" style={{ justifyContent: "center", width: "100%" }
            }>
                <LoadingSpinner />
            </Stack>
        )
    }

    {/* Show a message is no user was found matching the query. */ }
    if (!users.length && isValidSearchLength) {
        return (
            <Stack padding={12}>
                <em style={{
                    color: theme.colors.grey80,
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    fontSize: "12px"
                }}>
                    No matching users found. Please try again.
                </em>
            </Stack>
        )
    }

    return (
        <Stack vertical padding={12} gap={6} style={{ width: "100%" }}>
            {users.map((user) => {
                const isSelected = user.userId === selectedUserId
                return (
                    <Stack
                        key={user.userId}
                        gap={10}
                        style={{ width: "100%", alignItems: "center" }} >

                        <Checkbox onChange={() => {
                            if (isSelected) {
                                setSelectedUserId(undefined)
                                return
                            }
                            setSelectedUserId(user.userId)
                        }} checked={isSelected} />
                        <div>
                            <P5 style={{ fontsize: "12px", fontWeight: 600 }}>{user.name}</P5>
                            <P6 style={{ color: theme?.colors?.grey80 }}>{`<${user.email}>`}</P6>
                        </div>
                    </Stack>
                )
            })}
        </Stack>
    )

}