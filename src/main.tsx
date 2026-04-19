import App from "./App";
import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const theme = localStorage.getItem("lms_theme");
if (theme === "light") {
  document.documentElement.classList.remove("dark");
} else {
  document.documentElement.classList.add("dark");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
