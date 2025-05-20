import { DivAsInput, Dropdown, DropdownTargetProps, DropdownValueType, Label, P8, Stack } from "@deskpro/deskpro-ui"
import { faCaretDown, faCheck, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons"
import { IEnvelopeTemplate } from "@/api/types"
import { useDeskproAppTheme } from "@deskpro/app-sdk"
import { useMemo } from "react"
import { UseSendEnvelopeTemplateForm } from "../hooks/useSendEnvelopeTemplateForm"
import ErrorText from "@/components/ErrorText"
import Required from "@/components/forms/Required"

interface EnvelopeTemplateDropdownProps {
    formData: UseSendEnvelopeTemplateForm["formData"]
    envelopeTemplates: IEnvelopeTemplate[]
}

function buildDropdownOption(template: IEnvelopeTemplate): DropdownValueType<string> {
    return {
        key: template.templateId,
        label: <Label label={template.name} />,
        value: template.name,
        type: "value" as const,
    }
}

export default function EnvelopeTemplateDropdown(props: Readonly<EnvelopeTemplateDropdownProps>) {
    const { formData, envelopeTemplates } = props
    const { theme } = useDeskproAppTheme()

    const dropdownOptions: DropdownValueType<string>[] = useMemo(() => {
        return envelopeTemplates?.map((template) => {
            return buildDropdownOption(template)
        })
    }, [envelopeTemplates])

    const selectedTemplateId = formData.values.get("templateId")
    return (
        <Stack vertical style={{ width: "100%" }} gap={8}>
            <Stack vertical style={{ width: "100%" }}>
                <P8 style={{ color: theme?.colors?.grey80 }}>Select a Template <Required /></P8>
            </Stack>

            <Dropdown<string, HTMLDivElement>
                placement="bottom-start"
                options={dropdownOptions}
                fetchMoreText={"Fetch more"}
                autoscrollText={"Autoscroll"}
                selectedIcon={faCheck}
                externalLinkIcon={faExternalLinkAlt}
                onSelectOption={(option) => {
                    formData.values.set("templateId", option.key)
                }}
            >
                {({ targetProps, targetRef }: DropdownTargetProps<HTMLDivElement>) => (
                    <DivAsInput
                        ref={targetRef}
                        {...targetProps}
                        variant="inline"
                        rightIcon={faCaretDown}
                        placeholder="Select an option"
                        style={{ fontWeight: "400 !important" }}
                        value={dropdownOptions.find((dropdownOption) => {
                            return dropdownOption.key == selectedTemplateId
                        }
                        )?.value ?? undefined}
                    />
                )}
            </Dropdown>

            <ErrorText>
                {formData.errors.templateId?.message}
            </ErrorText>
        </Stack>
    )
}