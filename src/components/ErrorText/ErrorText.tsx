import { useDeskproAppTheme } from "@deskpro/app-sdk"
import { P8 } from "@deskpro/deskpro-ui"

export default function ErrorText(props: Readonly<{ children: React.ReactNode | string | JSX.Element }>) {
    const { theme } = useDeskproAppTheme()

    if (!props.children) {
        return null
    }
    return (
        <P8 style={{ color: theme.colors.red80 }}>{props.children}</P8>
    )
}