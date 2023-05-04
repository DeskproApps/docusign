import styled from "styled-components";
import { Stack } from "@deskpro/deskpro-ui";

import { ReactElement } from "react";

const Divider = styled.div`
  display: inline-block;
  min-width: 1px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.grey20};
  margin: 0px 6px 0px 0px;
`;

export const PropertyRow = ({ children }: { children: ReactElement[] }) => {
  return (
    <Stack style={{ position: "relative", width: "100%" }}>
      {children.map((child, idx) => (
        <Stack
          key={idx}
          style={{
            position: idx === 0 ? "relative" : "absolute",
            height: "100%",
            width: `${idx === 0 ? 100 : 100 / children.length}%`,
            left: `${idx * (100 / children.length)}%`,
          }}
        >
          {idx !== 0 && <Divider />}
          <Stack
            style={{ maxWidth: `${(idx + 1) * (100 / children.length) - 5}%` }}
          >
            {child}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
};
