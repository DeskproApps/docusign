import { AllowedRecipientFormMeta, DefaultRecipient, Recipient } from "@/types/docusign/form"
import { Button } from "@deskpro/deskpro-ui";
import { FieldError, FieldErrorsImpl, Merge, UseFormRegister } from "react-hook-form";
import { Fragment } from "react";
import { HorizontalDivider } from "@deskpro/app-sdk";
import ErrorText from "@/components/ErrorText";
import InputGroup from "@/components/InputGroup";

type SignerRecipient<M extends AllowedRecipientFormMeta> = Recipient<"signers", M>

// Automatically create a union of all allowed form types.
// We just need to update AllowedRecipientFormMeta in the future to support new forms.
type SignerRecipientUnion = AllowedRecipientFormMeta extends infer FormMeta
    ? FormMeta extends AllowedRecipientFormMeta
    ? SignerRecipient<FormMeta>
    : never
    : never

interface SignerFieldsProps{
    signers: SignerRecipientUnion
    signerErrors: Merge<FieldError, (Merge<FieldError, FieldErrorsImpl<DefaultRecipient>> | undefined)[]> | undefined

    // I tried using a discriminated union to accurately represent the type here but couldn't
    // get rid of the signature mismatch error.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    register: UseFormRegister<any>
}

export default function SignerFields(props: Readonly<SignerFieldsProps>) {
    const { signers, signerErrors, register } = props

    return (<>
        {signers.fields.map((signerField, index) => {
            return (
                <Fragment key={signerField.id}>
                    {/* Signer Name Input. */}
                    <InputGroup
                        type="text"
                        label="Signer Name"
                        defaultValue={signerField.name ?? ""}
                        hasError={!!signerErrors?.[index]?.name}
                        required
                        name={`recipients.signers.${index}.name`}
                        register={register(`recipients.signers.${index}.name`)}
                    />
                    <ErrorText>
                        {signerErrors?.[index]?.name?.message}
                    </ErrorText>

                    {/* Signer Email Input. */}
                    <InputGroup
                        type="email"
                        label="Signer Email"
                        defaultValue={signerField.email ?? ""}
                        hasError={!!signerErrors?.[index]?.email}
                        required
                        name={`recipients.signers.${index}.email`}
                        register={register(`recipients.signers.${index}.email`)}
                    />
                    <ErrorText>
                        {signerErrors?.[index]?.email?.message}
                    </ErrorText>

                    {/* Remove Signer Button. */}
                    {/* There must be at least one signer. */}
                    {index !== 0 && (<Button intent="secondary" text="Remove" onClick={() => {
                        signers.remove(index)
                    }} />)}

                    {/* Don't show the divider for the last element. */}
                    {index + 1 !== signers.fields.length && (<HorizontalDivider style={{ width: "100%" }} />)}
                </Fragment>
            )
        })}

        {/* Add Signer Button. */}
        <Button intent="secondary" text={`Add ${signers?.fields.length ? "another" : "a"} signer`} onClick={() => {
            signers.append(signers.default)
        }} />
    </>)
}