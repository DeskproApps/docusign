import { Button } from "@deskpro/deskpro-ui";
import { CreateEnvelopeFormMeta } from "@/pages/envelopes/create/schema";
import { DefaultRecipient, Recipient } from "@/types/docusign/form"
import { FieldError, FieldErrorsImpl, Merge, UseFormRegister } from "react-hook-form";
import { Fragment } from "react";
import { HorizontalDivider } from "@deskpro/app-sdk";
import ErrorText from "@/components/ErrorText";
import InputGroup from "@/components/InputGroup";


interface CarbonCopyFieldsProps {
    carbonCopies: Recipient<"carbonCopies"> | undefined
    carbonCopyErrors: Merge<FieldError, (Merge<FieldError, FieldErrorsImpl<DefaultRecipient>> | undefined)[]> | undefined
    register: UseFormRegister<CreateEnvelopeFormMeta>
}

export default function CarbonCopyFields(props: Readonly<CarbonCopyFieldsProps>) {
    const { carbonCopies, carbonCopyErrors, register } = props

    return (<>
        {carbonCopies?.fields.map((field, index) => (
            <Fragment key={field.id}>
                {/* CC Recipient Name */}
                <InputGroup
                    type="text"
                    label="Recipient Name"
                    hasError={!!carbonCopyErrors?.[index]?.name}
                    required
                    name={`recipients.carbonCopies.${index}.name`}
                    register={register(`recipients.carbonCopies.${index}.name`)}
                />
                <ErrorText>
                    {carbonCopyErrors?.[index]?.name?.message}
                </ErrorText>

                {/* CC Recipient Email */}
                <InputGroup
                    type="email"
                    label="Recipient Email"
                    hasError={!!carbonCopyErrors?.[index]?.email}
                    required
                    name={`recipients.carbonCopies.${index}.email`}
                    register={register(`recipients.carbonCopies.${index}.email`)}
                />
                <ErrorText>
                    {carbonCopyErrors?.[index]?.email?.message}
                </ErrorText>

                {/* Remove CC Button. */}
                <Button intent="secondary" text="Remove" onClick={() => {
                    carbonCopies.remove(index)
                }} />

                {/* Don't show the divider for the last element. */}
                {index + 1 !== carbonCopies.fields.length && (<HorizontalDivider style={{ width: "100%" }} />)}
            </Fragment>
        ))}

        {/* Add Carbon Copy Button. */}
        <Button intent="secondary" text={`Add ${carbonCopies?.fields.length ? "another" : "a"} CC`} onClick={() => {
            carbonCopies?.append(carbonCopies.default)
        }} />
    </>)
}