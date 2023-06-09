/* eslint-disable @typescript-eslint/ban-ts-comment */
import { LoadingSpinner } from "@deskpro/app-sdk";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";
import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import {
  QueryClientProvider,
  QueryErrorResetBoundary,
} from "@tanstack/react-query";
import "flatpickr/dist/themes/light.css";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { HashRouter, Route, Routes } from "react-router-dom";
import "simplebar/dist/simplebar.min.css";
import "tippy.js/dist/tippy.css";
import { ErrorFallback } from "./components/ErrorFallback/ErrorFallback";
import { Redirect } from "./components/Redirect/Redirect";
import { GlobalAuth } from "./pages/Admin/GlobalAuth";
import { Warning } from "./pages/Admin/Warning";
import { CreateEnvelope } from "./pages/Create/CreateEnvelope";
import { Main } from "./pages/Main";
import { query } from "./utils/query";

function App() {
  return (
    <HashRouter>
      <QueryClientProvider client={query}>
        <Suspense fallback={<LoadingSpinner />}>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
                <Routes>
                  <Route path="/">
                    <Route path="/redirect" element={<Redirect />} />
                    <Route index element={<Main />} />
                    <Route path="admin">
                      <Route path="globalauth" element={<GlobalAuth />} />
                      <Route path="warning" element={<Warning />} />
                    </Route>
                    <Route
                      path="createEnvelope/:submitType"
                      element={<CreateEnvelope />}
                    />
                  </Route>
                </Routes>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </Suspense>
      </QueryClientProvider>
    </HashRouter>
  );
}

export default App;
