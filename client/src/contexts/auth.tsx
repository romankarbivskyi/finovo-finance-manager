import { createContext, useState } from "react";
import { api } from "@/lib/api";

interface AuthContextType {
  user: string | null;
  isAuthenticated: boolean;
  setUser: (user: string | null) => void;
  login: (email: string, password: string) => void;
  register: (username: string, email: string, password: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = createContext<AuthContextType | null>(null);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const isAuthenticated = !!user;

  const login = (email: string, password: string) => {
    api
      .post("/users/login", { email, password })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  };

  const register = (username: string, email: string, password: string) => {
    api
      .post("/users/register", { username, email, password })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Registration failed:", error);
      });
  };

  const logout = () => {
    api
      .post("/users/logout")
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuthenticated, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
