import { useDeskproAppEvents } from "@deskpro/app-sdk";

import { Route, Routes, useNavigate } from "react-router-dom";
import { GlobalAuth } from "./pages/Admin/GlobalAuth";
import { Warning } from "./pages/Admin/Warning";
import { CreateEnvelopePage, EnvelopeListPage, SendEnvelopeTemplatePage } from "./pages/envelopes";
import { LinkUserPage } from "./pages/users";
import isValidPayload from "./utils/isValidPayload";

function App() {
  const navigate = useNavigate()

  useDeskproAppEvents({
    async onElementEvent(id, _type, payload) {

      if (isValidPayload(payload)) {
        switch (payload.type) {
          case "changePath": {
            if (payload.path) {
              void navigate(payload.path)
            }
            break
          }
        }
      }
    },
  }, [])

  return (
    <Routes>
      <Route path="/">
        <Route index element={<EnvelopeListPage />} />
        <Route path="admin">
          <Route path="globalauth" element={<GlobalAuth />} />
          <Route path="warning" element={<Warning />} />
        </Route>
        <Route path="envelopes">
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
