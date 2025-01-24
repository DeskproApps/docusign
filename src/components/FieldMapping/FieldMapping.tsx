import {
  useDeskproAppTheme,
} from "@deskpro/app-sdk";
import {
  H1,
  H3,
  P11,
  P8,
  Stack,
  P5,
} from "@deskpro/deskpro-ui";
import { IJson } from "../../types/json";
import { ReactElement } from "react";
import { mapFieldValues } from "../../utils/mapFieldValues";
import { StyledLink } from "../../styles";
import { LogoAndLinkButton } from "../LogoAndLinkButton/LogoAndLinkButton";
import { PropertyRow } from "../PropertyRow/PropertyRow";
import { HorizontalDivider } from "../HorizontalDivider/HorizontalDivider";

const SpaceBetweenFields = ({
  field: field,
}: {
  field: {
    key: string | number;
    value: string | number | ReactElement;
  };
}) => {
  return (
    <Stack
      style={{
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <H1>{field.key}:</H1>
      <H1>{field.value}</H1>
    </Stack>
  );
};

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: any[];
  internalUrl?: string;
  externalUrl?: string;
  metadata: IJson["view"];
  idKey?: string;
  internalChildUrl?: string;
  externalChildUrl?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  childTitleAccessor?: (field: any) => string | ReactElement;
  title?: string;
};

export const FieldMapping = ({
  fields,
  externalUrl,
  internalUrl,
  metadata,
  idKey = "",
  internalChildUrl,
  externalChildUrl,
  childTitleAccessor,
  title,
}: Props) => {
  const { theme } = useDeskproAppTheme();

  return (
    <Stack vertical gap={4} style={{ width: "100%" }}>
      <Stack
        style={{
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
        }}
      >
        {title && internalUrl ? (
          <StyledLink title="title" to={internalUrl + fields[0][idKey]}>
            {title}
          </StyledLink>
        ) : (
          <H1>{title}</H1>
        )}
        {externalUrl && (
          <LogoAndLinkButton endpoint={externalUrl}></LogoAndLinkButton>
        )}
      </Stack>
      {fields.map((field, i) => (
        <Stack vertical style={{ width: "100%" }} gap={5} key={i}>
          {(internalChildUrl || childTitleAccessor || externalChildUrl) && (
            <Stack
              style={{
                justifyContent: "space-between",
                width: "100%",
                alignItems: "flex-end",
              }}
            >
              {internalChildUrl && childTitleAccessor && (
                <StyledLink to={internalChildUrl + field[idKey]}>
                  {childTitleAccessor(field)}
                </StyledLink>
              )}
              {!internalChildUrl &&
                childTitleAccessor &&
                childTitleAccessor(field)}
              {externalChildUrl && (
                <LogoAndLinkButton
                  endpoint={externalChildUrl + field[idKey]}
                ></LogoAndLinkButton>
              )}
            </Stack>
          )}
          {metadata?.map((metadataFields, i) => {
            const usableFields = mapFieldValues(metadataFields, field);

            switch (usableFields.length) {
              case 1:
                return (
                  usableFields[0].value && (
                    <Stack vertical gap={4} key={i}>
                      <P8 style={{ color: theme?.colors.grey80 }}>
                        {usableFields[0].key}
                      </P8>
                      <P5 style={{ whiteSpace: "pre-line" }}>
                        {usableFields[0].value}
                      </P5>
                    </Stack>
                  )
                );
              case 4:
              case 2:
                return (
                  <Stack style={{ width: "100%" }} vertical gap={5} key={i}>
                    <PropertyRow key={i}>
                      {usableFields
                        .filter((_, i) => i !== 2)
                        .map((e, ii) => (
                          <Stack vertical key={ii}>
                            <P8 style={{ color: theme?.colors.grey80 }}>
                              {e.key}
                            </P8>
                            <P5>{e.value != null ? e.value : "-"}</P5>
                          </Stack>
                        ))}
                    </PropertyRow>
                  </Stack>
                );

              case 3:
                return (
                  <Stack
                    style={{ justifyContent: "space-between", width: "100%" }}
                    key={i}
                  >
                    <Stack vertical gap={4}>
                      <P5 theme={theme}>{usableFields[0].value}</P5>
                      <P11 style={{ whiteSpace: "pre-line" }}>
                        {usableFields[1].value}
                      </P11>
                    </Stack>
                    <H3>{usableFields[2].value}</H3>
                  </Stack>
                );

              default:
                return (
                  <Stack gap={20} vertical style={{ width: "100%" }} key={i}>
                    {usableFields
                      .filter((e) => e.key)
                      .map((usableField, usableFieldI) => (
                        <Stack
                          vertical
                          style={{ width: "100%" }}
                          key={usableFieldI}
                        >
                          <SpaceBetweenFields
                            field={usableField}
                          ></SpaceBetweenFields>
                        </Stack>
                      ))}
                  </Stack>
                );
            }
          })}
          <HorizontalDivider />
        </Stack>
      ))}
    </Stack>
  );
};
