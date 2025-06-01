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
  UsersPage,
} from "@/pages";
import {
  AdminLayout,
  DashboardLayout,
  HomeLayout,
  RootLayout,
} from "@/layouts";

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
          {
            path: "*",
            element: <NotFound />,
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
          {
            path: "/",
            element: <AdminLayout />,
            children: [
              {
                path: "/users",
                element: <UsersPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
