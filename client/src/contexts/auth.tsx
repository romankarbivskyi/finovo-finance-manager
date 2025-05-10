import { createContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { User } from "@/types/user";
import { toast } from "sonner";
import { AxiosError, type AxiosResponse } from "axios";
import type { ApiResponse } from "@/types/api.types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  getProfile: () => Promise<User | null>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const isAuthenticated: boolean = !!user;

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await api.post("/users/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const getProfile = async (): Promise<User | null> => {
    try {
      const response = await api.get<
        ApiResponse<User>,
        AxiosResponse<ApiResponse<User>>
      >("/users/profile");

      const { data, success } = response.data;

      if (success && data) {
        setUser(data);
        return data;
      } else {
        setUser(null);
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const error = err.response?.data as ApiResponse<User>;
        if (error) {
          setUser(null);
        }
      }
    }
    return null;
  };

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      await getProfile();
      setIsInitializing(false);
    };

    initAuth();
  }, []);

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading: isLoading || isInitializing,
    logout,
    getProfile,
    setUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
