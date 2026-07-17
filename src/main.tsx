import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { PremiumProvider } from "./lib/premium";
import { AuthProvider } from "./lib/auth";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PremiumProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </PremiumProvider>
  </StrictMode>
);
