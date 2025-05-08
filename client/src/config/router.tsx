import { createBrowserRouter } from "react-router";
import { HomePage } from "@/pages";
import { DashboardLayout } from "@/layouts";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [],
  },
]);
