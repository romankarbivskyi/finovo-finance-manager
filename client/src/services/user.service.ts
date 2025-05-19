import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type { User } from "@/types/user.types";
import { AxiosError } from "axios";

export const login = async (
  email: string,
  password: string,
): Promise<ApiResponse<User>> => {
  try {
    const response = await api.post<ApiResponse<User>>("/users/login", {
      email,
      password,
    });

    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiResponse<User>>;
    return (
      error.response?.data || {
        success: false,
      }
    );
  }
};

export const register = async (
  username: string,
  email: string,
  password: string,
): Promise<ApiResponse<User>> => {
  try {
    const response = await api.post<ApiResponse<User>>("/users/register", {
      username,
      email,
      password,
    });

    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiResponse<User>>;
    return (
      error.response?.data || {
        success: false,
      }
    );
  }
};

export const sendRecoveryToken = async (
  email: string,
): Promise<ApiResponse<null>> => {
  try {
    const response = await api.post<ApiResponse<null>>(
      "/users/password/forgot",
      {
        email,
      },
    );

    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiResponse<null>>;
    return (
      error.response?.data || {
        success: false,
      }
    );
  }
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
) => {
  try {
    const response = await api.post<ApiResponse<null>>(
      "/users/password/change",
      {
        current_password: currentPassword,
        new_password: newPassword,
      },
    );

    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiResponse<null>>;
    return (
      error.response?.data || {
        success: false,
      }
    );
  }
};

export const resetPassword = async (token: string, password: string) => {
  try {
    const response = await api.post<ApiResponse<null>>(
      "/users/password/reset",
      {
        token,
        password,
      },
    );

    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiResponse<null>>;
    return (
      error.response?.data || {
        success: false,
      }
    );
  }
};

export const deleteAccount = async () => {
  try {
    const response = await api.delete<ApiResponse<null>>("/users");

    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiResponse<null>>;
    return (
      error.response?.data || {
        success: false,
      }
    );
  }
};

export const updateProfile = async (username: string, email: string) => {
  try {
    const response = await api.post<ApiResponse<null>>("/users/profile", {
      username,
      email,
    });

    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiResponse<null>>;
    return (
      error.response?.data || {
        success: false,
      }
    );
  }
};
