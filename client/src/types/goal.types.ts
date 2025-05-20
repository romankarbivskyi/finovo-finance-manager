export interface Goal {
  id: number;
  user_id: number;
  name: string;
  description: string;
  target_date: string;
  current_amount: number;
  target_amount: number;
  currency: GoalCurrency;
  preview_image: string;
  status: GoalStatus;
  created_at: Date;
}

export interface GoalsResponse {
  goals: Goal[];
  total: number;
}

export interface GoalsStats {
  total: number;
  completed: number;
  active: number;
}

export type GoalStatus = "active" | "completed";

export type GoalCurrency = "USD" | "EUR" | "UAH";
