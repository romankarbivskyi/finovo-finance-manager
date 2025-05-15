import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type { Goal, GoalsResponse } from "@/types/goal.types";
import type { TransactionsResponse } from "@/types/transaction.types";
import type { AxiosError } from "axios";

export const fetchAllGoals = async (
  limit: number,
  offset: number,
): Promise<ApiResponse<GoalsResponse>> => {
  try {
    const response = await api.get<ApiResponse<GoalsResponse>>("/goals", {
      params: {
        limit,
        offset,
      },
    });

    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiResponse<GoalsResponse>>;
    return (
      error.response?.data || {
        success: false,
      }
    );
  }
};

export const fetchGoalById = async (
  goalId: string,
): Promise<ApiResponse<Goal>> => {
  try {
    const response = await api.get<ApiResponse<Goal>>(`/goals/${goalId}`);

    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiResponse<Goal>>;
    return (
      error.response?.data || {
        success: false,
      }
    );
  }
};

export const createOrUpdateGoal = async (
  goal: FormData,
  goalId?: number,
): Promise<ApiResponse<Goal>> => {
  try {
    const url = goalId ? `/goals/${goalId}` : "/goals";
    const response = await api.post(url, goal, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiResponse<Goal>>;
    return (
      error.response?.data || {
        success: false,
      }
    );
  }
};

export const deleteGoal = async (goalId: number): Promise<ApiResponse> => {
  try {
    const response = await api.delete(`/goals/${goalId}`);

    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiResponse>;
    return (
      error.response?.data || {
        success: false,
      }
    );
  }
};

export const fetchGoalTransactions = async (
  goalId: number,
  limit: number,
  offset: number,
) => {
  try {
    const response = await api.get<ApiResponse<TransactionsResponse>>(
      `/goals/${goalId}/transactions`,
      {
        params: {
          limit,
          offset,
        },
      },
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiResponse<TransactionsResponse>>;
    return (
      error.response?.data || {
        success: false,
      }
    );
  }
};
