export interface Goal {
  id: number;
  user_id: number;
  name: string;
  description: string;
  target_date: string;
  current_amount: number;
  target_amount: number;
  currency: "USD" | "EUR" | "UAH";
  preview_image: string;
  status: "active" | "completed";
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
