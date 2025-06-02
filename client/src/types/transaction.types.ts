export interface ITransaction {
  id: number;
  goal_id: number;
  user_id: number;
  amount: number;
  currency: string;
  description: string;
  transaction_type: "contribution" | "withdrawal";
  goal_name: string;
  created_at: Date;
}

export interface TransactionsResponse {
  transactions: ITransaction[];
  total: number;
}

export interface TransactionsStats {
  total_contributions: number;
  total_withdrawals: number;
  total_transactions: number;
  created_at: Date;
}
