import axios from "axios";
import { getSession } from "next-auth/react";
import type { QueryClient } from "@tanstack/react-query";

let queryClient: QueryClient | null = null;

export function setQueryClient(client: QueryClient) {
  queryClient = client;
}

const token = await getSession();
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
    Authorization: token?.accessToken
      ? `Bearer ${token.accessToken}`
      : undefined,
  },
  validateStatus: (status) => status >= 200 && status < 300,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if ((error?.response?.status === 401 || error?.response?.status === 403) && queryClient) {
      queryClient.invalidateQueries();
    }
    return Promise.reject(error);
  },
);
