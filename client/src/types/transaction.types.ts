export interface ITransaction {
  id: number;
  goal_id: number;
  user_id: number;
  amount: number;
  description: string;
  transaction_type: "income" | "expense";
  created_at: Date;
}

export interface TransactionsResponse {
  transactions: ITransaction[];
  total: number;
}
