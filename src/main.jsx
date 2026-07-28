import React from "react";
import { createRoot } from "react-dom/client";
import { BudgetApp } from "./app/BudgetApp.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BudgetApp />
  </React.StrictMode>
);
