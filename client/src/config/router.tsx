import { createBrowserRouter } from "react-router";
import {
  AccountPage,
  CreateGoalPage,
  DashboardPage,
  EditGoalPage,
  GoalDetailsPage,
  GoalsPage,
  HomePage,
  NotFound,
  ResetPasswordPage,
  TransactionsPage,
} from "@/pages";
import { DashboardLayout, HomeLayout, RootLayout } from "@/layouts";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomeLayout />,
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "/reset-password",
            element: <ResetPasswordPage />,
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
            path: "/goals/:goalId/edit",
            element: <EditGoalPage />,
          },
          {
            path: "/goals/create",
            element: <CreateGoalPage />,
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
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
