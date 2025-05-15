import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type { Transaction } from "@/types/transaction.types";
import type { AxiosError } from "axios";

export const createTransaction = async (
  goalId: number,
  amount: number,
  description: string,
  type: "income" | "expense",
): Promise<ApiResponse<Transaction>> => {
  try {
    const response = await api.post<ApiResponse<Transaction>>("/transactions", {
      goal_id: goalId,
      amount,
      description,
      transaction_type: type,
    });
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiResponse<Transaction>>;
    return (
      error.response?.data || {
        success: false,
      }
    );
  }
};
