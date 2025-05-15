import { fetchGoalById } from "@/services/goal.service";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useParams, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  CreateTransactionModal,
  DeleteGoalModal,
  GoalFormModal,
} from "@/components";

const GoalDetailsPage = () => {
  const { goalId } = useParams();

  const {
    data: apiResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["goal", goalId],
    queryFn: async () => await fetchGoalById(goalId!),
    enabled: !!goalId,
    refetchInterval: 10000,
  });

  const goal = apiResponse?.data || null;
  const {
    id,
    name,
    description,
    current_amount,
    target_amount,
    currency,
    preview_image,
    target_date,
    created_at,
  } = goal!;

  if (isLoading && !goal) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-4">
        <p className="text-lg font-medium">Goal not found</p>
        <Button asChild>
          <Link to="/goals">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Goals
          </Link>
        </Button>
      </div>
    );
  }

  const progressPercentage = Math.round((current_amount / target_amount) * 100);
  const remaining = target_amount - current_amount;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/goals">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{name}</h1>
        </div>

        <div className="flex gap-2">
          <GoalFormModal type="edit" goal={goal} />
          <DeleteGoalModal goalId={id} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            {preview_image && (
              <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                <img
                  src={preview_image}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{name}</CardTitle>
                <Badge>{status}</Badge>
              </div>
              <CardDescription>
                {description || "No description provided"}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-muted-foreground text-sm">Target Date</p>
                <p className="font-medium">
                  {format(new Date(target_date), "PPP")}
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Progress</p>
                  <p className="text-sm">{progressPercentage}%</p>
                </div>
                <Progress value={progressPercentage} className="h-2" />

                <div className="text-muted-foreground flex flex-wrap justify-between text-sm">
                  <p>
                    Current:{" "}
                    <span className="text-foreground font-medium">
                      {current_amount} {currency}
                    </span>
                  </p>
                  <p>
                    Target:{" "}
                    <span className="text-foreground font-medium">
                      {target_amount} {currency}
                    </span>
                  </p>
                </div>

                {current_amount < target_amount && (
                  <p className="text-sm">
                    You need{" "}
                    <span className="font-semibold">
                      {remaining} {currency}
                    </span>{" "}
                    more to reach your goal
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Transactions</CardTitle>
                <CardDescription>
                  Track your progress with transactions
                </CardDescription>
              </div>
              <CreateTransactionModal goalId={id} refetch={refetch} />
            </CardHeader>

            <CardContent>
              <div className="rounded-lg border p-8 text-center">
                <p className="text-muted-foreground">
                  No transactions yet. Add your first transaction to track
                  progress.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Goal Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{format(new Date(created_at), "PPP")}</span>
              </div>

              <Separator />

              <div>
                <p className="mb-2 font-medium">Saving Suggestion</p>
                <p className="text-muted-foreground text-sm">
                  To reach your goal by the target date, you should save
                  approximately
                  <span className="text-foreground mx-1 font-medium">
                    {(
                      remaining /
                      Math.max(
                        1,
                        Math.ceil(
                          (new Date(target_date).getTime() -
                            new Date().getTime()) /
                            (1000 * 60 * 60 * 24 * 30),
                        ),
                      )
                    ).toFixed(2)}
                  </span>
                  {currency} per month.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GoalDetailsPage;
