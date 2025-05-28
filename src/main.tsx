import './instrument';
import "./main.css";
import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";
import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "flatpickr/dist/themes/light.css";
import "simplebar/dist/simplebar.min.css";
import "tippy.js/dist/tippy.css";
import { DeskproAppProvider, LoadingSpinner } from "@deskpro/app-sdk";
import { HashRouter } from "react-router-dom";
import { query } from "./utils/query";
import { QueryClientProvider, QueryErrorResetBoundary } from "@tanstack/react-query";
import { Scrollbar } from "@deskpro/deskpro-ui";
import { Suspense } from "react";
import App from "./App";
import ErrorFallbackPage from "./pages/error";
import ReactDOM from "react-dom/client";
import { ErrorBoundary, reactErrorHandler } from '@sentry/react';


const root = ReactDOM.createRoot(document.getElementById('root') as Element, {
  onRecoverableError: reactErrorHandler(),
});
root.render(
  <Scrollbar style={{ height: "100%", width: "100%" }}>
    <DeskproAppProvider>
      <HashRouter>
        <QueryClientProvider client={query}>
          <Suspense fallback={<LoadingSpinner />}>
            <QueryErrorResetBoundary>
              {({ reset }) => {
                return (<ErrorBoundary onReset={reset} fallback={ErrorFallbackPage}>
                  <App />
                </ErrorBoundary>)
              }}
            </QueryErrorResetBoundary>
          </Suspense>
        </QueryClientProvider>
      </HashRouter>
    </DeskproAppProvider>
  </Scrollbar>
);
