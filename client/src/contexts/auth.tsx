import { createContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { User } from "@/types/user";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  getProfile: () => Promise<void>;
  login: (email: string, password: string) => void;
  register: (username: string, email: string, password: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = !!user;

  const login = (email: string, password: string) => {
    setIsLoading(true);
    api
      .post("/users/login", { email, password })
      .then((response) => {
        setUser(response.data.data);
      })
      .catch((error) => {
        console.error("Login failed:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const register = (username: string, email: string, password: string) => {
    setIsLoading(true);
    api
      .post("/users/register", { username, email, password })
      .then((response) => {
        setUser(response.data.data);
      })
      .catch((error) => {
        console.error("Registration failed:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const logout = () => {
    setIsLoading(true);
    api
      .post("/users/logout")
      .then(() => {
        setUser(null);
      })
      .catch((error) => {
        console.error("Logout failed:", error);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getProfile = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/users/profile");
      if (response.data?.data) {
        setUser(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        getProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
