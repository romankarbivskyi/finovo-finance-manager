import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./config/router";
import { AuthProvider } from "./contexts/auth";
import { RootLayout } from "./layouts";

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <RootLayout>
      <RouterProvider router={router} />
    </RootLayout>
  </AuthProvider>,
);
