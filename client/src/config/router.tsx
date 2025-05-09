import { createBrowserRouter } from "react-router";
import { DashboardPage, HomePage, NotFound, TransactionsPage } from "@/pages";
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
        element: <DashboardPage />,
      },
      {
        path: "/transactions",
        element: <TransactionsPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
