import { H2, Stack } from "@deskpro/deskpro-ui";
import React from "react";

interface FormSectionProps {
    children: React.ReactNode
    headingText: string
}

export default function FormSection(props: Readonly<FormSectionProps>) {
    const { children, headingText } = props

    return (
        <Stack vertical gap={12} padding={12} style={{ width: "100%" }}>
            <H2 style={{ fontSize: "12px", fontWeight: 500 }}>{headingText}</H2>
            {children}
        </Stack>
    )
}