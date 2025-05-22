import "./Callout.css";
import { faTimes, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Prettify } from "@/types/general";
import { useDeskproAppTheme } from "@deskpro/app-sdk";
import { useState } from "react";
import getCalloutThemeColors, { CalloutTheme } from "./getCalloutThemeColors";

interface BaseCalloutProps {
    icon?: IconDefinition
    headingText?: string
    accent?: CalloutTheme
    children: React.ReactNode
}

type CalloutProps = Prettify<React.ComponentPropsWithoutRef<'div'> & (
    | (BaseCalloutProps & {
        showCloseIcon: true
        onCloseIconClick?: () => void
    })
    | (BaseCalloutProps & {
        showCloseIcon?: false
        onCloseIconClick?: never
    })
)>

export default function Callout(props: Readonly<CalloutProps>) {
    const { icon, headingText, children, accent = "grey", showCloseIcon = false, onCloseIconClick, style, className, ...rest } = props
    const { theme: deskproTheme } = useDeskproAppTheme()
    const [isHidden, setIsHidden] = useState(false)

    const calloutColors = getCalloutThemeColors(accent, deskproTheme)

    const calloutBannerStyles = {
        '--accent-10': calloutColors.accent10,
        '--accent-80': calloutColors.accent80,
        '--accent-100': calloutColors.accent100,
        '--grey-60': deskproTheme.colors.grey40,
        '--red-60': deskproTheme.colors.red60,
        display: isHidden ? 'none' : 'flex',
        ...(style ?? {}),
    }
    return (
        <div {...rest} className="callout-banner" style={calloutBannerStyles}>
            <div className="callout-left">
                {icon && (<div className="callout-icon">
                    <FontAwesomeIcon icon={icon} />
                </div>)}

                <div className="callout-text">
                    {headingText && (<div className="heading-text">{headingText}</div>)}
                    <p>{children}</p>
                </div>
            </div>

            {showCloseIcon && (
                <div>
                    <button className="callout-close-button" onClick={() => { setIsHidden(true); onCloseIconClick?.() }}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
            )}

        </div>
    )
}