/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AnyIcon,
  AttachmentTag,
  Button,
  H1,
  LoadingSpinner,
  P8,
  Stack,
  useDeskproAppTheme,
  useDeskproLatestAppContext,
  useQueryWithClient,
} from "@deskpro/app-sdk";
import { LabelButton, LabelButtonFileInput } from "@deskpro/deskpro-ui";
import { faFile, faPlus } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";

import { zodResolver } from "@hookform/resolvers/zod";
import { Reducer, useEffect, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { ZodObject, ZodTypeAny, z } from "zod";
import { getTemplates, sendEnvelope } from "../../api/api";
import { DropdownSelect } from "../../components/DropdownSelect/DropdownSelect";
import { HorizontalDivider } from "../../components/HorizontalDivider/HorizontalDivider";
import { InputWithTitleForm } from "../../components/InputWithTitle/InputWithTitleForm";
import { InputWithTitleReducer } from "../../components/InputWithTitle/InputWithTitleReducer";
import { useQueryMutationWithClient } from "../../hooks/useQueryMutation";
import { getMetadataBasedSchema } from "../../schemas/default";
import { toBase64 } from "../../utils/utils";

const initialState = {
  signers: [
    {
      name: "",
      email: "",
    },
  ],
  ccs: [],
};

type ReducerType = {
  signers: { name: string; email: string }[];
  ccs: { name: string; email: string }[];
};

type Action = {
  data: { name?: string; email?: string };
  index?: number;
  type: string;
};

const reducer: Reducer<ReducerType, Action> = (state, action) => {
  const newState = { ...state };

  switch (action.type) {
    case "remove-cc":
      if (newState.ccs.length === 1) return { ...newState };

      newState.ccs.splice(action.index as number, 1);

      return { ...newState };
    case "add-cc":
      newState.ccs.push(
        action.data as unknown as { name: string; email: string }
      );
      return { ...newState };
    case "edit-cc":
      newState.ccs[action.index as number] = {
        ...newState.ccs[action.index as number],
        ...action.data,
      };
      return { ...newState };
    case "remove-signer":
      if (newState.signers.length === 1) return { ...newState };

      newState.signers.splice(action.index as number, 1);

      return { ...newState };
    case "add-signer":
      newState.signers.push(
        action.data as unknown as { name: string; email: string }
      );
      return { ...newState };
    case "edit-signer":
      newState.signers[action.index as number] = {
        ...newState.signers[action.index as number],
        ...action.data,
      };
      return { ...newState };
    default:
      return { ...newState };
  }
};

export const CreateEnvelope = () => {
  const { submitType } = useParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { theme } = useDeskproAppTheme();
  const [schema, setSchema] = useState<ZodTypeAny>(z.object({}));
  const { context } = useDeskproLatestAppContext();
  const [isReset, setIsReset] = useState(false);

  const navigate = useNavigate();

  const submitMutation = useQueryMutationWithClient<any, any>((client, data) =>
    sendEnvelope(client, data)
  );

  const templatesQuery = useQueryWithClient(
    ["templates"],
    (client) => getTemplates(client),
    {
      enabled: submitType === "template",
    }
  );
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    setError,
  } = useForm<any>({
    resolver: zodResolver(schema as ZodObject<any>),
  });

  useEffect(() => {
    if (!context || !dispatch || isReset) return;

    dispatch({
      type: "edit-signer",
      index: 0,
      data: {
        name: `${context.data.user.firstName} ${context.data.user.lastName}`,
        email: context.data.user.primaryEmail,
      },
    });
    setIsReset(true);
  }, [context, isReset]);

  useEffect(() => {
    if (!submitType) return;

    const newObj: { [key: string]: ZodTypeAny } = {
      emailSubject: z.string().nonempty(),
      attachments: submitType === "file" ? z.any() : z.any().optional(),
      templateId:
        submitType === "template" ? z.string() : z.string().optional(),
    };

    setSchema(
      getMetadataBasedSchema(
        [
          {
            name: "emailSubject",
          },
          {
            name: "attachments",
          },
        ],
        newObj
      )
    );
  }, [submitType]);

  const submit = async (data: any) => {
    if (state.signers.filter((e) => !!e.email && !!e.name).length === 0) {
      setError("signers", {
        type: "manual",
        message: "You need to add at least one signer",
      });

      return;
    }

    const newObj = {
      emailSubject: data.emailSubject,
      documents: data.attachments
        ? [
            {
              documentBase64: await toBase64(data.attachments),
              name: data.attachments.name,
              fileExtension: data.attachments.type?.split("/")[1],
              documentId: 1,
            },
          ]
        : [],
      status: "sent",
      templateId: data.templateId ? data.templateId : undefined,
      templateRoles:
        [...state.ccs, ...state.signers].filter((e) => !!e.email && !!e.name)
          .length > 0 && submitType === "template"
          ? [
              ...state.signers.map((e) => ({
                name: e.name,
                email: e.email,
                roleName: "signer",
              })),
              ...state.ccs.map((e) => ({
                name: e.name,
                email: e.email,
                roleName: "cc",
              })),
            ]
          : [],
      recipients:
        [...state.ccs, ...state.signers].filter((e) => !!e.email && !!e.name)
          .length > 0 && submitType === "file"
          ? {
              carbonCopies: state.ccs
                .filter((e) => !!e.email && !!e.name)
                .map((e) => ({
                  fullName: e.name,
                  email: e.email,
                  name: e.name,
                  recipientId: uuidv4(),
                })),
              signers: state.signers.map((e) => ({
                fullName: e.name,
                email: e.email,
                name: e.name,
                recipientId: uuidv4(),
              })),
            }
          : {},
    };

    submitMutation.mutate(newObj);
  };

  useEffect(() => {
    submitMutation.isSuccess && navigate(-1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitMutation.isSuccess]);

  const file = watch("attachments");

  if (templatesQuery.isFetching) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <Stack vertical gap={8}>
        <H1>Send a Template</H1>
        {submitType === "template" && templatesQuery.isSuccess && (
          <Stack vertical style={{ width: "100%" }}>
            <DropdownSelect
              title="Select a template"
              value={watch("templateId")}
              onChange={(e) => setValue("templateId", e)}
              error={!!errors["templateId"]}
              keyName="templateId"
              valueName="name"
              data-testid="template-select"
              data={templatesQuery.data?.envelopeTemplates || []}
            />
            <P8 style={{ color: theme.colors.red80 }}>
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
              {/*@ts-ignore*/}
              {errors["templateId"]?.message}
            </P8>
          </Stack>
        )}
        <InputWithTitleForm
          register={register("emailSubject")}
          title="Email subject"
          required={true}
          data-testid="email-subject-input"
          error={!!errors["emailSubject"]}
        ></InputWithTitleForm>
        <P8 style={{ color: theme.colors.red80 }}>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
          {/*@ts-ignore*/}
          {errors["emailSubject"]?.message}
        </P8>
        {submitType === "file" && (
          <Stack vertical style={{ width: "100%" }}>
            <Stack>
              <P8 style={{ color: theme.colors.grey80 }}>File</P8>
              <Stack style={{ color: theme?.colors?.red100 }}>
                <H1>⠀*</H1>
              </Stack>
            </Stack>
            {file && (
              <AttachmentTag
                download
                filename={
                  file.name.length > 19
                    ? `${file.name.substring(0, 19)}...`
                    : file.name
                }
                fileSize={file.size}
                icon={faFile as AnyIcon}
                withClose
                onClose={() => setValue("attachments", null)}
              ></AttachmentTag>
            )}
            <LabelButton
              style={{ padding: "0px" }}
              icon={faPlus as AnyIcon}
              text="Add"
              minimal
            >
              <LabelButtonFileInput
                accept="image/jpeg, image/jpg, image/png, image/pjpeg, application/pdf, application/word, application/doc, application/docx"
                data-testid="file-input"
                onChange={(e) =>
                  setValue("attachments", e.target?.files?.[0] ?? null)
                }
              />
            </LabelButton>
            <P8 style={{ color: theme.colors.red80 }}>
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
              {/*@ts-ignore*/}
              {errors["attachments"]?.message}
            </P8>
          </Stack>
        )}
        <HorizontalDivider />
        <Stack vertical style={{ width: "100%" }}>
          <H1>Add a Signer</H1>
          {state.signers.map((signer, index) => (
            <Stack vertical gap={5} key={index} style={{ width: "100%" }}>
              <InputWithTitleReducer
                title="Signer name"
                type="signer"
                dispatch={dispatch}
                field="name"
                data-testid={`signer-name-input-${index}`}
                value={signer.name}
                i={index}
                required={true}
              />
              <InputWithTitleReducer
                title="Signer email"
                type="signer"
                dispatch={dispatch}
                field="email"
                data-testid={`signer-email-input-${index}`}
                value={signer.email}
                i={index}
                required={true}
              />
              <Button
                intent="secondary"
                onClick={() =>
                  dispatch({ type: "remove-signer", index, data: {} })
                }
                text="Remove"
              />
              {errors["signers"] && (
                <P8 style={{ color: theme.colors.red80 }}>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
                  {/*@ts-ignore*/}
                  {errors["signers"]?.message}
                </P8>
              )}
              <HorizontalDivider />
            </Stack>
          ))}
        </Stack>
        <Stack vertical style={{ width: "100%" }}>
          <H1>Add a CC</H1>
          {state.ccs.map((cc, index) => (
            <Stack vertical gap={5} key={index} style={{ width: "100%" }}>
              <InputWithTitleReducer
                title="CC name"
                type="cc"
                dispatch={dispatch}
                field="name"
                data-testid={`cc-name-input-${index}`}
                value={cc.name}
                i={index}
              />
              <InputWithTitleReducer
                title="CC email"
                type="cc"
                dispatch={dispatch}
                field="email"
                data-testid={`cc-email-input-${index}`}
                value={cc.email}
                i={index}
              />
              <Button
                intent="secondary"
                onClick={() => dispatch({ type: "remove-cc", index, data: {} })}
                text="Remove"
              />
              <HorizontalDivider />
            </Stack>
          ))}
        </Stack>

        <Stack vertical gap={12}>
          <Button
            intent="secondary"
            text="Add a signer"
            onClick={() => {
              dispatch({
                type: "add-signer",
                data: {
                  name: "",
                  email: "",
                },
              });
            }}
          />
          <Button
            intent="secondary"
            onClick={() => {
              dispatch({
                type: "add-cc",
                data: {
                  name: "",
                  email: "",
                },
              });
            }}
            text="Add a CC"
          />
        </Stack>
        <Stack gap={8} justify="space-between" style={{ width: "100%" }}>
          <Button
            type="submit"
            text={(() => {
              switch (`${submitType}-${submitMutation.isLoading}`) {
                case "file-true":
                  return "Sending...";
                case "file-false":
                  return "Send";
                case "template-true":
                  return "Sending...";
                case "template-false":
                  return "Send";
                default:
                  return "Create";
              }
            })()}
            data-testid="submit-button"
          />
          <Button
            intent="secondary"
            onClick={() => navigate(-1)}
            text="Cancel"
          />
        </Stack>

        {submitMutation.isError && (
          <P8 style={{ color: theme.colors.red100 }}>
            {submitMutation.error as string}
          </P8>
        )}
      </Stack>
      {submitMutation.isSuccess && <P8>Success</P8>}
    </form>
  );
};
