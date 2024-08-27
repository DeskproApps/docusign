import ReactDOM from "react-dom/client";
import App from "./App";
import { DeskproAppProvider, Scrollbar } from "@deskpro/app-sdk";
import "./main.css";
import "simplebar/dist/simplebar.min.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Scrollbar style={{ height: "100%", width: "100%" }}>
    <DeskproAppProvider>
      <App />
    </DeskproAppProvider>
  </Scrollbar>
);
