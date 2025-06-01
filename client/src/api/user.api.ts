import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type { User, UsersResponse } from "@/types/user.types";
import { handleApiRequest } from ".";

export const login = (
  email: string,
  password: string,
): Promise<ApiResponse<User>> => {
  return handleApiRequest(
    async () =>
      await api.post<ApiResponse<User>>("/users/login", {
        email,
        password,
      }),
  );
};

export const register = (
  username: string,
  email: string,
  password: string,
): Promise<ApiResponse<User>> => {
  return handleApiRequest(
    async () =>
      await api.post<ApiResponse<User>>("/users/register", {
        username,
        email,
        password,
      }),
  );
};

export const sendRecoveryToken = (
  email: string,
): Promise<ApiResponse<null>> => {
  return handleApiRequest(
    async () =>
      await api.post<ApiResponse<null>>("/users/password/forgot", {
        email,
      }),
  );
};

export const changePassword = (
  currentPassword: string,
  newPassword: string,
) => {
  return handleApiRequest(
    async () =>
      await api.post<ApiResponse<null>>("/users/password/change", {
        current_password: currentPassword,
        new_password: newPassword,
      }),
  );
};

export const resetPassword = (token: string, password: string) => {
  return handleApiRequest(
    async () =>
      await api.post<ApiResponse<null>>("/users/password/reset", {
        token,
        password,
      }),
  );
};

export const deleteAccount = (id?: number) => {
  return handleApiRequest(
    async () =>
      await api.delete<ApiResponse<null>>(`/users${id ? `/${id}` : ""}`),
  );
};

export const updateProfile = (username: string, email: string) => {
  return handleApiRequest(
    async () =>
      await api.post<ApiResponse<null>>("/users/profile", {
        username,
        email,
      }),
  );
};

export const fetchAllUsers = (limit: number, offset: number, sort?: string) => {
  return handleApiRequest(
    async () =>
      await api.get<ApiResponse<UsersResponse>>("/users", {
        params: {
          limit,
          offset,
          ...(sort && { sort }),
        },
      }),
  );
};
