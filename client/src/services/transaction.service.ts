import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type { ITransaction } from "@/types/transaction.types";
import type { AxiosError } from "axios";

export const createTransaction = async (
  goalId: number,
  amount: number,
  description: string,
  type: "income" | "expense",
): Promise<ApiResponse<ITransaction>> => {
  try {
    const response = await api.post<ApiResponse<ITransaction>>(
      "/transactions",
      {
        goal_id: goalId,
        amount,
        description,
        transaction_type: type,
      },
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiResponse<ITransaction>>;
    return (
      error.response?.data || {
        success: false,
      }
    );
  }
};

export const deleteTransaction = async (
  transactionId: number,
): Promise<ApiResponse> => {
  try {
    const response = await api.delete<ApiResponse>(
      `/transactions/${transactionId}`,
    );
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
