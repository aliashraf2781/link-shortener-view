import { api } from "@/lib/axios";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface RegisterResult {
  message: string;
}

export interface VerifyResetCodePayload {
  email: string;
  code: string;
}

export interface VerifyResetCodeResult {
  message: string;
  verify_token: string;
}

export interface ResetPasswordPayload {
  verify_token: string;
  password: string;
  password_confirmation: string;
}

export interface ResetPasswordResult {
  message: string;
}

type ApiResponse = {
  message?: string;
  data?: {
    message?: string;
    verify_token?: string;
  };
  success?: boolean;
  status?: number | string;
  error?: unknown;
  errors?: unknown;
};

function getMessage(data: ApiResponse | undefined, fallback: string) {
  return data?.message ?? data?.data?.message ?? fallback;
}

function assertSuccess(data: ApiResponse | undefined, fallback: string) {
  const hasError =
    (typeof data?.status === "number" && data.status !== 200 && data.status !== 201) ||
    data?.success === false ||
    data?.status === "error" ||
    Boolean(data?.error) ||
    Boolean(data?.errors);

  if (hasError) {
    throw new Error(getMessage(data, fallback));
  }

  return getMessage(data, fallback);
}

export async function registerUser(payload: RegisterPayload) {
  const response = await api.post("/register", payload);
  const message = assertSuccess(response?.data, "Registration successful");
  return { message } satisfies RegisterResult;
}

export async function forgotPassword(email: string) {
  const response = await api.post("/forgot-password", { email });
  const message = assertSuccess(
    response?.data,
    "Password reset link sent"
  );
  return { message };
}

export async function verifyResetCode(payload: VerifyResetCodePayload) {
  const response = await api.post("/forgot-password/verify", payload);
  const message = assertSuccess(
    response?.data,
    "Code verified successfully"
  );
  const verify_token = response?.data?.data?.verify_token;

  if (!verify_token) {
    throw new Error("Missing verification token");
  }

  return { message, verify_token } satisfies VerifyResetCodeResult;
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const response = await api.post("/reset-password", payload);
  const message = assertSuccess(
    response?.data,
    "Password reset successfully"
  );
  return { message } satisfies ResetPasswordResult;
}
export async function logout() {
  const response = await api.post("/logout");
  const message = assertSuccess(response?.data, "Logout successful");
  return { message };
}