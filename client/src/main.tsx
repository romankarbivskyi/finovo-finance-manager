import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./config/router";
import { AuthProvider } from "./contexts/auth";
import { RootLayout } from "./layouts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RootLayout>
        <RouterProvider router={router} />
      </RootLayout>
    </AuthProvider>
  </QueryClientProvider>,
);
