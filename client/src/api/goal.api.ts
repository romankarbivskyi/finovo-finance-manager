import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type { Goal, GoalsResponse, GoalsStats } from "@/types/goal.types";
import type { TransactionsResponse } from "@/types/transaction.types";
import { handleApiRequest } from ".";

export const fetchAllGoals = (
  limit: number,
  offset: number,
  currency?: string,
  status?: string,
  sort?: string,
  search?: string,
): Promise<ApiResponse<GoalsResponse>> => {
  return handleApiRequest(
    async () =>
      await api.get<ApiResponse<GoalsResponse>>("/goals", {
        params: {
          limit,
          offset,
          ...(currency && { currency }),
          ...(status && { status }),
          ...(sort && { sort }),
          ...(search && { search }),
        },
      }),
  );
};

export const fetchGoalById = (goalId: string): Promise<ApiResponse<Goal>> => {
  return handleApiRequest(
    async () => await api.get<ApiResponse<Goal>>(`/goals/${goalId}`),
  );
};

export const createOrUpdateGoal = (
  goal: FormData,
  goalId?: number,
): Promise<ApiResponse<Goal>> => {
  const url = goalId ? `/goals/${goalId}` : "/goals";
  return handleApiRequest(
    async () =>
      await api.post(url, goal, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
  );
};

export const deleteGoal = (goalId: number): Promise<ApiResponse> => {
  return handleApiRequest(
    async () => await api.delete<ApiResponse>(`/goals/${goalId}`),
  );
};

export const fetchGoalTransactions = (
  goalId: number,
  limit: number,
  offset: number,
) => {
  return handleApiRequest(
    async () =>
      await api.get<ApiResponse<TransactionsResponse>>(
        `/goals/${goalId}/transactions`,
        {
          params: {
            limit,
            offset,
          },
        },
      ),
  );
};

export const getGoalsStats = (): Promise<ApiResponse<GoalsStats>> => {
  return handleApiRequest(
    async () => await api.get<ApiResponse<GoalsStats>>("/goals/stats"),
  );
};
