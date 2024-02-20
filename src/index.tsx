import ReactDOM from "react-dom/client";
import "./assets/styles/global.css";
import "@fontsource/maven-pro";
import "@fontsource/maven-pro/400.css";
import App from "./App";

// =======================================================================================================

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <App />
);
