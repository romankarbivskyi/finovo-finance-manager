import type { ApiResponse } from "@/types/api.types";
import type { AxiosResponse, AxiosError } from "axios";

export const handleApiRequest = async <T>(
  fn: () => Promise<AxiosResponse<ApiResponse<T>>>,
): Promise<ApiResponse<T>> => {
  try {
    const response = await fn();
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiResponse<T>>;
    return error.response?.data || { success: false };
  }
};
