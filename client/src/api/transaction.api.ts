import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type {
  ITransaction,
  TransactionsResponse,
} from "@/types/transaction.types";
import type { AxiosError } from "axios";

export const createTransaction = async (
  goalId: number,
  amount: number,
  currency: "USD" | "EUR" | "UAH",
  description: string,
  type: "contribution" | "withdrawal",
): Promise<ApiResponse<ITransaction>> => {
  try {
    const response = await api.post<ApiResponse<ITransaction>>(
      "/transactions",
      {
        goal_id: goalId,
        amount,
        currency,
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

export const getAllTransactions = async (
  limit: number,
  offset: number,
): Promise<ApiResponse<TransactionsResponse>> => {
  try {
    const response = await api.get<ApiResponse<TransactionsResponse>>(
      "/transactions",
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
