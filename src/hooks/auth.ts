import type { UseMutationOptions } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import {
  forgotPassword,
  registerUser,
  resetPassword,
  verifyResetCode,
  logout,
} from "@/services";

interface MessageResult {
  message: string;
}

interface VerifyResetCodeResult {
  message: string;
  verify_token: string;
}

export function useRegisterMutation(
  options?: UseMutationOptions<MessageResult, unknown, Parameters<typeof registerUser>[0]>
) {
  return useMutation({
    mutationFn: registerUser,
    ...options,
  });
}

export function useForgotPasswordMutation(
  options?: UseMutationOptions<MessageResult, unknown, string>
) {
  return useMutation({
    mutationFn: forgotPassword,
    ...options,
  });
}

export function useVerifyResetCodeMutation(
  options?: UseMutationOptions<VerifyResetCodeResult, unknown, Parameters<typeof verifyResetCode>[0]>
) {
  return useMutation({
    mutationFn: verifyResetCode,
    ...options,
  });
}

export function useResetPasswordMutation(
  options?: UseMutationOptions<MessageResult, unknown, Parameters<typeof resetPassword>[0]>
) {
  return useMutation({
    mutationFn: resetPassword,
    ...options,
  });
}
export function useLogoutMutation(
  options?: UseMutationOptions<MessageResult, unknown, void>
) {
  return useMutation({
    mutationFn: logout,
    ...options,
  });
}