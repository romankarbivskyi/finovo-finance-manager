import type { Goal } from "@/types/goal.types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Progress } from "./ui/progress";

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
  } = goal;

  const progressValue = Math.round((current_amount / target_amount) * 100);

  return (
    <Card className="flex h-full flex-col">
      <CardContent className="pt-6">
        <div className="aspect-video w-full overflow-hidden rounded-md">
          <img
            src={preview_image}
            alt={`Preview image: ${name}`}
            className="h-full w-full object-cover"
          />
        </div>
      </CardContent>

      <CardHeader className="flex-grow">
        <CardTitle className="line-clamp-1">{name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>

      <CardFooter className="flex flex-col gap-4">
        <div className="flex w-full items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {current_amount} / {target_amount}
          </span>
          <span className="text-sm font-medium text-gray-700">{currency}</span>
        </div>
        <Progress value={progressValue} className="h-2" />
      </CardFooter>
    </Card>
  );
};

export default GoalCard;
