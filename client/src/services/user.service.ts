import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type { User } from "@/types/user";
import { type AxiosResponse, AxiosError } from "axios";

export const login = async (
  email: string,
  password: string,
): Promise<ApiResponse<User>> => {
  try {
    const response = await api.post<
      ApiResponse<User>,
      AxiosResponse<ApiResponse<User>>
    >("/users/login", {
      email,
      password,
    });

    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiResponse<User>>;
    return {
      success: false,
      error:
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Login request failed",
      message: error.response?.data?.message || "Login failed",
    };
  }
};

export const register = async (
  username: string,
  email: string,
  password: string,
): Promise<ApiResponse<User>> => {
  try {
    const response = await api.post<
      ApiResponse<User>,
      AxiosResponse<ApiResponse<User>>
    >("/users/register", {
      username,
      email,
      password,
    });

    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiResponse<User>>;
    return {
      success: false,
      error:
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Registration request failed",
      message: error.response?.data?.message || "Registration failed",
    };
  }
};

export const sendRecoveryToken = async (
  email: string,
): Promise<ApiResponse<null>> => {
  try {
    const response = await api.post<
      ApiResponse<null>,
      AxiosResponse<ApiResponse<null>>
    >("/users/password/forgot", {
      email,
    });

    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiResponse<null>>;
    return {
      success: false,
      error:
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Recovery email request failed",
      message: error.response?.data?.message || "Failed to send recovery email",
    };
  }
};
