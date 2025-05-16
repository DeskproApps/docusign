import { useDeskproAppTheme } from "@deskpro/app-sdk";
import { Input, P8, Stack } from "@deskpro/deskpro-ui";
import { UseFormRegisterReturn } from "react-hook-form";

interface InputGroupProps extends React.ComponentPropsWithoutRef<'input'> {
    label: string
    hasError: boolean
    name: string
    register: UseFormRegisterReturn 
}

export default function InputGroup(props: Readonly<InputGroupProps>) {
    const { label, hasError, required, name, placeholder, register, ...inputProps } = props
    const { theme } = useDeskproAppTheme();

    return (
        <Stack vertical style={{ width: "100%", }}>
            <label htmlFor={name} style={{ color: theme?.colors?.grey80 }}>
                <P8>{label} {required && (
                    <span style={{ color: theme?.colors?.red100 }}>
                        *
                    </span>
                )}</P8>
            </label>

            <Input
                {...inputProps}
                id={name}
                style={{ fontWeight: "normal" }}
                error={hasError}
                variant="inline"
                placeholder={placeholder ?? "Enter value"}
                {...register}
            />
        </Stack>
    )

}