import { createBrowserRouter } from "react-router";
import {
  AccountPage,
  DashboardPage,
  GoalDetailsPage,
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
        path: "/goals/:goalId",
        element: <GoalDetailsPage />,
      },
      {
        path: "/transactions",
        element: <TransactionsPage />,
      },
      {
        path: "/account",
        element: <AccountPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
