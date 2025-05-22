import { Button, Stack } from "@deskpro/deskpro-ui";
import { HorizontalDivider, LoadingSpinner, useDeskproAppTheme, useDeskproElements, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { useNavigate } from "react-router-dom";
import EnvelopeListSection from "./components/EnvelopeListSection";
import useLinkedUser from "@/hooks/useLinkedUser";
import useUserEnvelopes from "@/hooks/useUserEnvelopes";

export default function EnvelopeListPage() {
  const navigate = useNavigate()
  const { theme } = useDeskproAppTheme()

  const { linkedUser } = useLinkedUser()
  const { envelopes, error, isLoading } = useUserEnvelopes(linkedUser?.email ?? "")

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Docusign")
  }, [])

  useDeskproElements(({ clearElements, registerElement, deRegisterElement }) => {
    clearElements()
    deRegisterElement("home")
    registerElement("refresh", { type: "refresh_button" })
    registerElement("menu", {
      type: "menu",
      items: [
        {
          title: "Unlink User",
          payload: {
            type: "unlink",
          },
        }
      ]
    })
  }, [])


  if (isLoading) {
    return (<LoadingSpinner />)
  }

  const sortedEnvelopes = envelopes.sort(
    (a, b) => {
      return new Date(b.lastModifiedDateTime).getTime() -
        new Date(a.lastModifiedDateTime).getTime()
    }
  )

  return (
    <Stack vertical gap={5}>
      <Stack vertical padding={12} gap={16} style={{ width: "100%" }}>
        <Button
          text="Create an envelope"
          intent="secondary"
          onClick={() => { void navigate(`/envelopes/create`) }}
        />
        <Button
          text="Send a template"
          intent="secondary"
          onClick={() => { void navigate(`/envelopes/templates/send`) }}
        />
      </Stack>

      <HorizontalDivider style={{ width: "100%" }} />

      <EnvelopeListSection navigate={navigate} linkedUser={linkedUser} theme={theme} envelopes={sortedEnvelopes} error={error} />
    </Stack>
  )
}
