import "./lib/network-debug";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { DebugPanel } from "./components/DebugPanel";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <DebugPanel />
  </>
);
