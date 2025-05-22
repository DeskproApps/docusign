import { useDeskproAppTheme } from "@deskpro/app-sdk";

export default function Required() {
    const { theme } = useDeskproAppTheme()
    return (
        <span style={{ color: theme?.colors?.red100 }}>*</span>
    )
}