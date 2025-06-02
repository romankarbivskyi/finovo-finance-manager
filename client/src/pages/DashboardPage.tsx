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
  CalendarIcon,
  CheckCircle2,
  Flag,
  LineChart,
  Loader2,
  Target,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import {
  getAllTransactions,
  getTransactionsStats,
} from "@/api/transaction.api";
import { Transaction } from "@/components";
import { useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const DashboardPage = () => {
  const [startDate, setStartDate] = useState<Date>(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [endDate, setEndDate] = useState<Date>(() => {
    return new Date();
  });

  const startDateString = startDate.toISOString().split("T")[0];
  const endDateString = endDate.toISOString().split("T")[0];

  const { data: goalsStatsResponse, isLoading: isGoalsStatsLoading } = useQuery(
    {
      queryKey: ["goalsStats"],
      queryFn: getGoalsStats,
    },
  );

  const { data: transactionsStatsResponse } = useQuery({
    queryKey: ["transactionsStats", startDateString, endDateString],
    queryFn: async () => {
      return await getTransactionsStats(startDateString, endDateString);
    },
    enabled: !!startDateString && !!endDateString,
  });

  const {
    data: lastTransactionsResponse,
    isLoading: isLastTransactionsLoading,
    refetch: refetchLastTransactions,
  } = useQuery({
    queryKey: ["lastTransactions"],
    queryFn: async () => await getAllTransactions(2, 0),
  });

  const { data: goalsStats } = goalsStatsResponse || {};
  const { data: transactionsStats } = transactionsStatsResponse || {};
  const { data: transactionsData } = lastTransactionsResponse || {};

  const chartConfig = {
    total_contributions: {
      label: "Total Contributions",
      color: "var(--chart-1)",
    },
    total_withdrawals: {
      label: "Total Withdrawals",
      color: "var(--chart-2)",
    },
    total_transactions: {
      label: "Total Transactions",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;

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
                <span>Transaction Analytics</span>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/transactions" className="gap-1 text-xs">
                    View All <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </CardTitle>
              <CardDescription>
                Daily contributions and withdrawals overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">From:</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "w-[200px] justify-start text-left font-normal",
                          !startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? (
                          format(startDate, "PPP")
                        ) : (
                          <span>Pick start date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          if (date) {
                            setStartDate(date);
                            if (endDate < date) {
                              setEndDate(date);
                            }
                          }
                        }}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(23, 59, 59, 999);
                          return date > today || (endDate && date > endDate);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">To:</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "w-[200px] justify-start text-left font-normal",
                          !endDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? (
                          format(endDate, "PPP")
                        ) : (
                          <span>Pick end date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => {
                          if (date) {
                            setEndDate(date);
                          }
                        }}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(23, 59, 59, 999);
                          return (
                            date > today || (startDate && date < startDate)
                          );
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      const lastWeek = new Date(today);
                      lastWeek.setDate(today.getDate() - 7);
                      setStartDate(lastWeek);
                      setEndDate(today);
                    }}
                  >
                    Last 7 days
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const today = new Date();
                      const lastMonth = new Date(today);
                      lastMonth.setMonth(today.getMonth() - 1);
                      setStartDate(lastMonth);
                      setEndDate(today);
                    }}
                  >
                    Last 30 days
                  </Button>
                </div>
              </div>

              {transactionsStats && transactionsStats.length > 0 ? (
                <ChartContainer config={chartConfig}>
                  <AreaChart
                    accessibilityLayer
                    data={transactionsStats}
                    margin={{
                      left: 12,
                      right: 12,
                      top: 12,
                      bottom: 12,
                    }}
                    height={300}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                      dataKey="created_at"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });
                      }}
                    />
                    <ChartTooltip
                      cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                      content={
                        <ChartTooltipContent
                          indicator="dot"
                          labelFormatter={(value) => {
                            const date = new Date(value);
                            return date.toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            });
                          }}
                        />
                      }
                    />
                    <defs>
                      <linearGradient
                        id="fillContributions"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-total_contributions)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-total_contributions)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="fillWithdrawals"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--color-total_withdrawals)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--color-total_withdrawals)"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      dataKey="total_contributions"
                      type="monotone"
                      fill="url(#fillContributions)"
                      fillOpacity={0.6}
                      stroke="var(--color-total_contributions)"
                      strokeWidth={2}
                      stackId="1"
                    />
                    <Area
                      dataKey="total_withdrawals"
                      type="monotone"
                      fill="url(#fillWithdrawals)"
                      fillOpacity={0.6}
                      stroke="var(--color-total_withdrawals)"
                      strokeWidth={2}
                      stackId="2"
                    />
                  </AreaChart>
                </ChartContainer>
              ) : (
                <div className="flex h-[300px] items-center justify-center">
                  <div className="text-center">
                    <LineChart className="text-muted-foreground mx-auto h-12 w-12" />
                    <h3 className="mt-4 text-lg font-medium">
                      No transaction data
                    </h3>
                    <p className="text-muted-foreground">
                      Start making transactions to see your analytics here.
                    </p>
                    <Button asChild className="mt-4">
                      <Link to="/transactions">Add Transaction</Link>
                    </Button>
                  </div>
                </div>
              )}
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

        <Card>
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
      </div>
    </div>
  );
};

export default DashboardPage;
