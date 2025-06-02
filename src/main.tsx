import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "./theme/theme-provider";
import CustomToaster from "./components/custom-toaster";
import "./i18n";
import ErrorBoundary from "./components/error-boundary";

const queryClient = new QueryClient();

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <ErrorBoundary>
            <RouterProvider router={router} />
            <CustomToaster />
          </ErrorBoundary>
        </ThemeProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
