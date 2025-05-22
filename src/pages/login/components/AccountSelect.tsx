import { Account, IUserInfo } from "@/types/docusign/general";
import { Button, H3, P5, Radio, Stack } from "@deskpro/deskpro-ui";
import { useState } from "react";

interface AccountSelectProps {
    user: IUserInfo
    onAccountConfirm: (accountId: string) => void
}

export default function AccountSelect(props: Readonly<AccountSelectProps>) {
    const { user, onAccountConfirm } = props
    const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null)
    const accounts = user.accounts
    const buttonIsDisabled = !selectedAccountId

    return (
        <Stack vertical gap={16}>
            <H3>Please select the account you'd like to use:</H3>

            <Stack vertical gap={8}>
                {accounts.map((account) => {
                    return (
                        <AccountItem
                            key={account.account_id}
                            account={account}
                            selectedAccountId={selectedAccountId}
                            setSelectedAccountId={setSelectedAccountId}
                        />
                    )
                })}
            </Stack>

            <Button
                text="Confirm"
                onClick={() => {
                    if (selectedAccountId) {
                        onAccountConfirm(selectedAccountId)
                    }
                }}
                style={{ cursor: buttonIsDisabled ? "not-allowed" : "pointer" }}
                intent={buttonIsDisabled ? "secondary" : "primary"}
                disabled={!selectedAccountId}
            />
        </Stack>
    )
}

interface AccountItemProps {
    account: Account
    selectedAccountId: string | null
    setSelectedAccountId: React.Dispatch<React.SetStateAction<string | null>>
}

function AccountItem(props: Readonly<AccountItemProps>) {
    const { account, selectedAccountId, setSelectedAccountId } = props
    return (
        <Stack gap={5}>
            <Radio
                checked={selectedAccountId === account.account_id}
                onChange={() => {
                    setSelectedAccountId(account.account_id)
                }}
            />
            <P5>{account.account_name}</P5>
        </Stack>
    )
}