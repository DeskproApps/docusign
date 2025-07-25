import { Account, IUserInfo } from "@/types/docusign/general";
import { Button, H3, P5, Radio, Stack } from "@deskpro/deskpro-ui";
import { useState } from "react";

interface AccountSelectProps {
    user: IUserInfo
    onAccountConfirm: (account: Account) => void
}

export default function AccountSelect(props: Readonly<AccountSelectProps>) {
    const { user, onAccountConfirm } = props
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
    const accounts = user.accounts
    const buttonIsDisabled = !selectedAccount

    return (
        <Stack vertical gap={16}>
            <H3>Please select the account you'd like to use:</H3>

            <Stack vertical gap={8}>
                {accounts.map((account) => {
                    return (
                        <AccountItem
                            key={account.account_id}
                            account={account}
                            selectedAccount={selectedAccount}
                            setSelectedAccount={setSelectedAccount}
                        />
                    )
                })}
            </Stack>

            <Button
                text="Confirm"
                onClick={() => {
                    if (selectedAccount) {
                        onAccountConfirm(selectedAccount)
                    }
                }}
                style={{ cursor: buttonIsDisabled ? "not-allowed" : "pointer" }}
                intent={buttonIsDisabled ? "secondary" : "primary"}
                disabled={!selectedAccount}
            />
        </Stack>
    )
}

interface AccountItemProps {
    account: Account
    selectedAccount: Account | null
    setSelectedAccount: React.Dispatch<React.SetStateAction<Account | null>>
}

function AccountItem(props: Readonly<AccountItemProps>) {
    const { account, selectedAccount, setSelectedAccount } = props
    return (
        <Stack gap={5}>
            <Radio
                checked={selectedAccount?.account_id === account.account_id}
                onChange={() => {
                    setSelectedAccount(account)
                }}
            />
            <P5>{account.account_name}</P5>
        </Stack>
    )
}