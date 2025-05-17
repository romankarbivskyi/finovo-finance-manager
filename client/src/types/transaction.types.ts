export interface ITransaction {
  id: number;
  goal_id: number;
  user_id: number;
  amount: number;
  currency: string;
  description: string;
  transaction_type: "contribution" | "withdrawal";
  created_at: Date;
}

export interface TransactionsResponse {
  transactions: ITransaction[];
  total: number;
}
