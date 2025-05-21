import type { Goal } from "@/types/goal.types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
import { Progress } from "./ui/progress";
import { Link } from "react-router";
import { ImageOff, Plus } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useModalStore } from "@/stores/modalStore";

interface GoalCardProps {
  goal: Goal;
  refetchGoals: () => void;
}

const GoalCard = ({ goal, refetchGoals }: GoalCardProps) => {
  const {
    id,
    name,
    description,
    preview_image,
    target_amount,
    current_amount,
    currency,
    status,
  } = goal;

  const progressValue =
    target_amount > 0
      ? Math.min(Math.round((current_amount / target_amount) * 100), 100)
      : 0;

  const { openModal } = useModalStore();

  const handleAddTransaction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openModal("createTransaction", {
      goalId: id,
      onCreate: refetchGoals,
      defaultCurrency: currency,
    });
  };

  return (
    <Link
      to={`/goals/${id}`}
      className="block transition-transform hover:scale-[1.01]"
    >
      <Card className="flex h-full flex-col gap-2 overflow-hidden p-0 pb-5 transition-shadow hover:shadow-md">
        <div className="bg-muted/20 relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-t-md">
          {preview_image ? (
            <img
              src={preview_image}
              alt={`Preview image: ${name}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageOff className="text-muted-foreground h-1/3 w-1/3 opacity-40" />
          )}
        </div>

        <CardHeader className="flex-grow">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="line-clamp-1 text-lg">{name}</CardTitle>
            <Badge variant={status === "active" ? "default" : "outline"}>
              {status}
            </Badge>
          </div>
          <CardDescription className="mt-1 line-clamp-2 min-h-[2.5rem]">
            {description || "No description provided"}
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex gap-4">
          <div className="flex w-full flex-col gap-2">
            <div className="flex w-full items-center justify-between">
              <span className="text-sm font-medium">
                {current_amount.toLocaleString()} /{" "}
                {target_amount.toLocaleString()}
              </span>
              <span className="text-sm font-medium">{currency}</span>
            </div>
            <div className="space-y-1">
              <Progress
                value={progressValue}
                className={`h-2 ${progressValue >= 100 ? "bg-green-500" : ""}`}
              />
              <p className="text-muted-foreground text-right text-xs">
                {progressValue}% complete
              </p>
            </div>
          </div>
          <Button
            size="icon"
            onClick={handleAddTransaction}
            className="shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default GoalCard;
