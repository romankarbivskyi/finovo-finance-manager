import { createBrowserRouter } from "react-router";
import {
  DashboardPage,
  GoalsPage,
  HomePage,
  NotFound,
  TransactionsPage,
} from "@/pages";
import { DashboardLayout, HomeLayout } from "@/layouts";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
  {
    element: <DashboardLayout />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/goals",
        element: <GoalsPage />,
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
