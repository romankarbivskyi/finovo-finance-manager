export interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  created_at: Date;
}
