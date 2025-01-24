import { useDeskproAppTheme } from "@deskpro/app-sdk";
import { H1, Input, P8, Stack } from "@deskpro/deskpro-ui"
import React from "react";

interface Props {
  title: string;
  error?: boolean;
  required?: boolean;
  type?: string;
  value?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: React.Dispatch<any>;
  i: number;
  field: string;
}

export const InputWithTitleReducer = ({
  title,
  error,
  required,
  type,
  field,
  i,
  value,
  dispatch,
  ...attributes
}: Props) => {
  const { theme } = useDeskproAppTheme();
  return (
    <Stack vertical style={{ width: "100%", marginTop: "5px" }}>
      <Stack>
        <div style={{ color: theme?.colors?.grey80 }}>
          <P8>{title}</P8>
        </div>
        {required && (
          <Stack style={{ color: theme?.colors?.red100 }}>
            <H1>⠀*</H1>
          </Stack>
        )}
      </Stack>
      <Input
        error={error}
        variant="inline"
        placeholder={`Enter value`}
        style={{ fontWeight: "normal" }}
        type={"title"}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          dispatch({
            type: `edit-${type}`,
            index: i,
            data: { [field]: e.target.value },
          });
        }}
        value={value}
        {...attributes}
      />
    </Stack>
  );
};
