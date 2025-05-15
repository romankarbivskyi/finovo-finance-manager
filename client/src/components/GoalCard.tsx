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
import { ImageOff } from "lucide-react";
import { Badge } from "./ui/badge";

interface GoalCardProps {
  goal: Goal;
  key?: number | string;
}

const GoalCard = ({ goal }: GoalCardProps) => {
  const {
    name,
    description,
    preview_image,
    target_amount,
    current_amount,
    currency,
    status,
  } = goal;

  const progressValue = Math.round((current_amount / target_amount) * 100);

  return (
    <Link to={`/goals/${goal.id}`}>
      <Card className="flex h-full flex-col p-0 pb-5">
        <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-t-md">
          {preview_image ? (
            <img
              src={preview_image}
              alt={`Preview image: ${name}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <ImageOff className="stroke-accent h-1/2 w-1/2" />
          )}
        </div>

        <CardHeader className="flex-grow">
          <div className="flex items-center justify-between">
            <CardTitle className="line-clamp-1">{name}</CardTitle>
            <Badge>{status}</Badge>
          </div>
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex flex-col gap-4">
          <div className="flex w-full items-center justify-between">
            <span className="text-foreground text-sm font-medium">
              {current_amount} / {target_amount}
            </span>
            <span className="text-foreground text-sm font-medium">
              {currency}
            </span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </CardFooter>
      </Card>
    </Link>
  );
};

export default GoalCard;
