import { Button, H1, Stack } from "@deskpro/deskpro-ui";
import { ContextData } from "@/types/deskpro"
import { HorizontalDivider, LoadingSpinner, useDeskproAppTheme, useDeskproElements, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { useNavigate } from "react-router-dom";
import { Fragment, useState } from "react";
import Callout from "@/components/Callout";
import EnvelopeInfo from "./EnvelopeInfo";
import getUserEnvelopes, { UserEnvelopes } from "./getUserEnvelopes";

export default function EnvelopeListPage() {
  const navigate = useNavigate()
  const { theme } = useDeskproAppTheme()

  const { context } = useDeskproLatestAppContext<ContextData, unknown>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [userEnvelopesMeta, setUserEnvelopesMeta] = useState<UserEnvelopes | null>(null)

  useDeskproElements(({clearElements, registerElement})=>{
          clearElements()
          registerElement("refresh", {type: "refresh_button"})
      }, [])

  const deskproUser = context?.data?.user
  const userEmail = deskproUser?.primaryEmail

  useInitialisedDeskproAppClient((client) => {
    void (async () => {
      if (!userEmail) {
        return
      }
      try {
        setIsLoading(true)

        const userData = await getUserEnvelopes(client, userEmail)
        setUserEnvelopesMeta(userData)

      } catch (e) {
        setFetchError(e instanceof Error ? e.message : "Unknown error while retrieving envelopes.")

      } finally {
        setIsLoading(false)
      }
    })()
  }, [userEmail])

  const hasEnvelopesForEmail = !isLoading && userEnvelopesMeta && (userEnvelopesMeta.envelopes?.length ?? 0) > 0

  if (isLoading) {
    return (<LoadingSpinner />)
  }

  const sortedEnvelopes = userEnvelopesMeta?.envelopes.sort(
    (a, b) => {
      return new Date(b.lastModifiedDateTime).getTime() -
        new Date(a.lastModifiedDateTime).getTime()
    }
  )

  return (
    <Stack vertical gap={5}>
      <Stack vertical padding={12} gap={16} style={{ width: "100%" }}>
        <Button
          text="Create envelope"
          intent="secondary"
          onClick={() => { void navigate(`/envelopes/create`) }}
        ></Button>
        <Button
          text="Send existing Template"
          intent="secondary"
          onClick={() => { void navigate(`createEnvelope/template`) }}
        ></Button>
      </Stack>

      <HorizontalDivider style={{ width: "100%" }} />

      {/* Show the error callout if an error occurs while fetching. */}
      {fetchError ? (
        <Stack style={{ width: "100%" }} padding={12}>
          <Callout
            accent="red"
            style={{ width: "100%" }}
          >
            {fetchError}
          </Callout>
        </Stack>

      ) :

        // Show message if there are no envelopes for the provided email.
        !hasEnvelopesForEmail ? (
          <Stack padding={12}>
            <em style={{
              color: theme.colors.grey80,
              whiteSpace: "normal",
              wordBreak: "break-word",
              fontSize: "12px"
            }}>
              No Envelopes Found For {userEmail}
            </em>
          </Stack>

        ) : (

          // Show the envelopes as usual if all is well.
          <Stack vertical padding={12} gap={5} style={{ width: "100%" }}>
            <H1>Envelopes ({sortedEnvelopes?.length ?? 0})</H1>
            <Stack vertical gap={20} style={{ width: "100%" }}>
              {sortedEnvelopes?.map((envelope, index) => (

                <Fragment key={envelope.envelopeId}>
                  <EnvelopeInfo
                    key={envelope.envelopeId}
                    envelope={envelope}
                    user={userEnvelopesMeta.user}
                    theme={theme}
                  />

                  {index + 1 !== sortedEnvelopes.length && <HorizontalDivider style={{ width: "100%" }} />}
                </Fragment>

              ))}


            </Stack>
          </Stack>
        )}
    </Stack>
  )
}
