/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, forwardRef } from "react";
import styled from "styled-components";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import {
  useDeskproAppTheme,
} from "@deskpro/app-sdk";
import {
  Input,
  Label as UILabel,
  Stack,
  H1,
  P8,
} from "@deskpro/deskpro-ui";
import "./DateField.css";

// @todo: this is a placeholder for the actual component
function DateTimePicker(props: any) { return <div {...props} />} 
type DatePickerProps = any;


const LabelDate = styled(UILabel)`
  margin-top: 5px;
`;

export type MappedFieldProps = DatePickerProps & {
  id: string;
  label: string;
  error: boolean;
  value?: string;
  onChange: (date: [Date]) => void;
};

const DateInput = styled(Input)`
  :read-only {
    cursor: pointer;
  }
`;

export const DateField: FC<MappedFieldProps> = forwardRef(
  (
    { id, value, label, error, onChange, required, ...props }: MappedFieldProps,
    ref
  ) => {
    const { theme } = useDeskproAppTheme();

    return (
      <DateTimePicker
        options={{
          altInput: true,
          altFormat: "j F Y H:i",
          position: "left",
          dateFormat: "d/m/Y",
          timeFormat: "H:i",
        }}
        value={value}
        onChange={onChange}
        {...props}
        ref={ref}
        render={(_: any, ref: any) => (
          <LabelDate htmlFor={id}>
            <Stack align="center" style={{ color: theme.colors.grey80 }}>
              <P8 style={{ color: theme.colors.grey80 }}>{label}</P8>
              {required && (
                <Stack style={{ color: "red" }}>
                  <H1>⠀*</H1>
                </Stack>
              )}
            </Stack>
            <div
              style={
                error
                  ? {
                      borderBottom: `1px solid ${theme.colors.red40}`,
                    }
                  : {}
              }
            >
              <DateInput
                id={id}
                ref={ref}
                error={error}
                variant="inline"
                inputsize="small"
                placeholder="DD/MM/YYYY"
                style={{ backgroundColor: "transparent" }}
                rightIcon={{
                  icon: faCalendarDays,
                  // doesnt like style, but it does accept it
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  style: {
                    color: theme.colors.grey40,
                  },
                }}
              />
            </div>
          </LabelDate>
        )}
      />
    );
  }
);
