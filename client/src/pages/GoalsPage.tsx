import { fetchAllGoals } from "@/services/goal.service";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DataList, GoalCard, Header } from "@/components";
import type { ApiResponse } from "@/types/api.types";
import type { GoalsResponse } from "@/types/goal.types";
import { ITEMS_PER_PAGE } from "@/constants";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

const GoalsPage = () => {
  const [page, setPage] = useState<number>(1);
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const { data: apiResponse, isLoading } = useQuery<
    ApiResponse<GoalsResponse>,
    Error
  >({
    queryKey: ["goals", offset, ITEMS_PER_PAGE],
    queryFn: () => fetchAllGoals(ITEMS_PER_PAGE, offset),
  });

  const { goals = [], total = 0 } = apiResponse?.data ?? {};

  return (
    <div>
      <Header title="Goals" subtitle="Manage your financial goals">
        <Button asChild>
          <Link to="/goals/create">
            Create New Goal <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </Header>

      <DataList
        data={goals}
        isLoading={isLoading}
        page={page}
        total={total}
        onPageChange={setPage}
        renderItem={(goal) => <GoalCard key={goal.id} goal={goal} />}
        containerClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      />
    </div>
  );
};

export default GoalsPage;
