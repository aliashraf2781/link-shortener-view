import type { z } from "zod";
import type { loginSchema, registerSchema, forgotPasswordSchema, codeVerification, resetPasswordSchema } from "@/schemas";

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type CodeVerificationInput = z.infer<typeof codeVerification>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
