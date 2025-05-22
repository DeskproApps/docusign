import { DeskproTheme } from "@deskpro/deskpro-ui";

type CssColor = Exclude<React.CSSProperties["color"], undefined>

interface CalloutColors {
    accent10: CssColor
    accent80: CssColor
    accent100: CssColor
}
export type CalloutTheme = "red" | "yellow" | "cyan" | "grey"

export default function getCalloutThemeColors(calloutTheme: CalloutTheme, deskproTheme: DeskproTheme): CalloutColors {
    switch (calloutTheme) {
        case "cyan":
            return {
                accent10: deskproTheme.colors.cyan10,
                accent80: deskproTheme.colors.cyan80,
                accent100: deskproTheme.colors.cyan100,
            }
        case "red":
            return {
                accent10: deskproTheme.colors.red10,
                accent80: deskproTheme.colors.red80,
                accent100: deskproTheme.colors.red100,
            }
        case "yellow":
            return {
                accent10: deskproTheme.colors.yellow10,
                accent80: deskproTheme.colors.yellow80,
                accent100: deskproTheme.colors.yellow100,
            }
        case "grey":
        default:
            return {
                accent10: deskproTheme.colors.grey10,
                accent80: deskproTheme.colors.grey20,
                accent100: deskproTheme.colors.grey100
            }
    }
}