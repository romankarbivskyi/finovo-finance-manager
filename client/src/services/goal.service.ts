import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type { GoalsResponse } from "@/types/goal.types";
import type { AxiosError } from "axios";

export const fetchAllGoals = async (
  limit: number,
  offset: number,
): Promise<ApiResponse<GoalsResponse>> => {
  try {
    const response = await api.get("/goals", {
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
