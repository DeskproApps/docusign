import { clearLinkedUserEntities } from "./services";
import { ContextData } from "./types/deskpro";
import { CreateEnvelopePage, EnvelopeListPage, SendEnvelopeTemplatePage } from "./pages/envelopes";
import { GlobalAuth } from "./pages/Admin/GlobalAuth";
import { LinkUserPage } from "./pages/users";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useDeskproAppClient, useDeskproAppEvents, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { Warning } from "./pages/Admin/Warning";
import isValidPayload from "./utils/isValidPayload";
import LoadingPage from "./pages/loading";

function App() {
  const navigate = useNavigate()
  const { client } = useDeskproAppClient()
  const { context } = useDeskproLatestAppContext<ContextData, unknown>()
  const deskproUser = context?.data?.user

  useDeskproAppEvents({
    async onElementEvent(id, _type, payload) {

      if (isValidPayload(payload)) {
        switch (payload.type) {
          case "changePath":
            if (payload.path) {
              void navigate(payload.path)
            }
            break
          case "unlink":
            if (!deskproUser?.id || !client) {
              return
            }
            void clearLinkedUserEntities(client, deskproUser.id)
              .then(() => {
                navigate("/users/link")
              })
              .catch(() => {
                navigate("/users/link")
              })
            break
        }
      }
    },
  }, [deskproUser?.id, client])

  return (
    <Routes>
      <Route path="/">
        <Route index element={<LoadingPage />} />
        <Route path="admin">
          <Route path="globalauth" element={<GlobalAuth />} />
          <Route path="warning" element={<Warning />} />
        </Route>
        <Route path="envelopes">
          <Route path="list" element={<EnvelopeListPage />} />
          <Route path="create" element={<CreateEnvelopePage />} />
          <Route path="templates/send" element={<SendEnvelopeTemplatePage />} />
        </Route>
        <Route path="users">
          <Route path="link" element={<LinkUserPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
