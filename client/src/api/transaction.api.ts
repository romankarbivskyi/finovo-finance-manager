import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type {
  ITransaction,
  TransactionsResponse,
  TransactionsStats,
} from "@/types/transaction.types";
import { handleApiRequest } from ".";

export const createTransaction = (
  goalId: number,
  amount: number,
  currency: "USD" | "EUR" | "UAH",
  description: string,
  type: "contribution" | "withdrawal",
): Promise<ApiResponse<ITransaction>> => {
  return handleApiRequest(
    async () =>
      await api.post<ApiResponse<ITransaction>>("/transactions", {
        goal_id: goalId,
        amount,
        currency,
        description,
        transaction_type: type,
      }),
  );
};

export const deleteTransaction = (
  transactionId: number,
): Promise<ApiResponse> => {
  return handleApiRequest(
    async () => await api.delete<ApiResponse>(`/transactions/${transactionId}`),
  );
};

export const getAllTransactions = (
  limit: number,
  offset: number,
): Promise<ApiResponse<TransactionsResponse>> => {
  return handleApiRequest(
    async () =>
      await api.get<ApiResponse<TransactionsResponse>>("/transactions", {
        params: {
          limit,
          offset,
        },
      }),
  );
};

export const getTransactionsStats = (
  startDate: string,
  endDate: string,
): Promise<ApiResponse<TransactionsStats[]>> => {
  return handleApiRequest(
    async () =>
      await api.get<ApiResponse<TransactionsStats[]>>("/transactions/stats", {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      }),
  );
};
