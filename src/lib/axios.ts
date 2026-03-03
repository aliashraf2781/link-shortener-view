import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import type { QueryClient } from "@tanstack/react-query";

let queryClient: QueryClient | null = null;

export function setQueryClient(client: QueryClient) {
  queryClient = client;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
  validateStatus: (status) => status >= 200 && status < 300,
});

// Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 || error?.) {
      if (queryClient) {
        queryClient.invalidateQueries();
      }
      signOut({ callbackUrl: "/auth/login" });
    }
    return Promise.reject(error);
  },
);
