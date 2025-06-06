import { BackLink, GoalForm } from "@/components";
import { fetchGoalById } from "@/api/goal.api";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router";

const EditGoalPage = () => {
  const { goalId } = useParams();

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ["goal", goalId],
    queryFn: async () => await fetchGoalById(goalId!),
    enabled: !!goalId,
  });

  const goal = apiResponse?.data;

  if (isLoading || !goal) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <BackLink to={`/goals/${goalId}`} />
      <GoalForm type="edit" goal={goal} />
    </div>
  );
};

export default EditGoalPage;
