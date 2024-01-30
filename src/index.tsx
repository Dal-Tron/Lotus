import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/styles/global.css";
import "@fontsource/maven-pro"; // Defaults to weight 400
import "@fontsource/maven-pro/400.css"; // Specify weight

// ========================================================

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
