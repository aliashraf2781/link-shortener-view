import axios from "axios";

export function getBackendMessage(
  error: unknown,
  fallback = "Something went wrong"
) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; error?: string };
    return data?.message || data?.error || fallback;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    return typeof message === "string" ? message : fallback;
  }

  return fallback;
}


