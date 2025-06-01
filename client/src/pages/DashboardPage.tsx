import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getGoalsStats } from "@/api/goal.api";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Flag,
  LineChart,
  Loader2,
  Target,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { getAllTransactions } from "@/api/transaction.api";
import { Transaction } from "@/components";

const DashboardPage = () => {
  const { data: goalsStatsResponse, isLoading: isGoalsStatsLoading } = useQuery(
    {
      queryKey: ["goalsStats"],
      queryFn: getGoalsStats,
    },
  );

  const {
    data: lastTransactionsResponse,
    isLoading: isLastTransactionsLoading,
    refetch: refetchLastTransactions,
  } = useQuery({
    queryKey: ["lastTransactions"],
    queryFn: async () => await getAllTransactions(2, 0),
  });

  const { data: goalsStats } = goalsStatsResponse || {};
  const { data: transactionsData } = lastTransactionsResponse || {};

  if (
    isGoalsStatsLoading ||
    !goalsStats ||
    isLastTransactionsLoading ||
    !transactionsData
  ) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  const { transactions } = transactionsData;

  const completionPercent = Math.round(
    (goalsStats.completed / (goalsStats.total || 1)) * 100,
  );

  return (
    <div className="container mx-auto space-y-8 py-6">
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Welcome to Your Finance Dashboard
            </h1>
            <p className="mt-2 max-w-md text-blue-100">
              Track your financial goals and manage your progress all in one
              place.
            </p>
          </div>
          <Button asChild variant="secondary" className="shrink-0">
            <Link to="/goals/create">
              Create New Goal <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold sm:text-2xl">Goals Overview</h2>
            <Link
              to="/goals"
              className="text-primary text-sm font-medium hover:underline"
            >
              View All Goals
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-t-4 border-t-blue-500">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Total Goals
                    </p>
                    <p className="text-3xl font-bold tracking-tight">
                      {goalsStats.total}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">
                      Completion rate
                    </span>
                    <span className="text-xs font-semibold">
                      {completionPercent}%
                    </span>
                  </div>
                  <Progress value={completionPercent} className="h-1.5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-green-500">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Active Goals
                    </p>
                    <p className="text-3xl font-bold tracking-tight">
                      {goalsStats.active}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <Flag className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-muted-foreground text-xs">
                    {Math.round(
                      (goalsStats.active / (goalsStats.total || 1)) * 100,
                    )}
                    % of your goals are currently active
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        goalsStats.active > 0 ? "bg-green-500" : "bg-muted"
                      }`}
                    ></span>
                    <span className="text-xs font-medium">
                      {goalsStats.active > 0
                        ? "In progress"
                        : "No active goals"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-purple-500 sm:col-span-2 lg:col-span-1">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">
                      Completed Goals
                    </p>
                    <p className="text-3xl font-bold tracking-tight">
                      {goalsStats.completed}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    <CheckCircle2 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-muted-foreground text-xs">
                    {goalsStats.completed > 0
                      ? `Congratulations! You've completed ${goalsStats.completed} goals.`
                      : "You haven't completed any goals yet."}
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        goalsStats.completed > 0 ? "bg-purple-500" : "bg-muted"
                      }`}
                    ></span>
                    <span className="text-xs font-medium">
                      {goalsStats.completed > 0 ? "Well done!" : "Keep going!"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Recent Transactions</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/transactions" className="gap-1 text-xs">
                    View All <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </CardTitle>
              <CardDescription>
                Your latest financial transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {transactions.length > 0 &&
                transactions.map((transaction) => (
                  <Transaction
                    transaction={transaction}
                    onDelete={refetchLastTransactions}
                  />
                ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you can perform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <Link to="/goals/create" className="gap-2">
                  <Target className="h-4 w-4" />
                  Create New Goal
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full justify-start"
              >
                <Link to="/goals" className="gap-2">
                  <LineChart className="h-4 w-4" />
                  View All Goals
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
