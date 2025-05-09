import { createBrowserRouter } from "react-router";
import { HomePage, NotFound } from "@/pages";
import { DashboardLayout } from "@/layouts";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    element: <DashboardLayout />,
    children: [
      {
        path: "/dashboard",
        element: <div>Dashboard</div>,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
