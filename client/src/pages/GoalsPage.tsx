import { GOALS_LIMIT } from "@/constants";
import { fetchAllGoals } from "@/services/goal.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Header } from "@/components";
import type { ApiResponse } from "@/types/api.types";
import type { GoalsResponse } from "@/types/goal.types";

const GoalsPage = () => {
  const [page, setPage] = useState<number>(0);

  const offset = page * GOALS_LIMIT;

  const { data: apiResponse, isLoading } = useQuery<
    ApiResponse<GoalsResponse>,
    Error
  >({
    queryKey: ["goals", offset, GOALS_LIMIT],
    queryFn: () => fetchAllGoals(GOALS_LIMIT, offset),
  });

  const { goals = [], total = 0 } = apiResponse?.data ?? {};

  if (isLoading && !apiResponse) {
    return <div>Loading...</div>;
  }

  console.log("Goals:", goals);
  console.log("Total Goals:", total);

  return (
    <div>
      <Header title="Goals" subtitle="Manage your financial goals" />
    </div>
  );
};

export default GoalsPage;
