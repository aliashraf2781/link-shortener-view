import { allowedDomains } from "@/constants";
import { z } from "zod";

const emailWithAllowedDomain = z
  .string()
  .email("Invalid email address")
  .refine(
    (email) => {
      const domain = email.split("@")[1];
      return allowedDomains.includes(domain);
    },
    { message: "This email domain is not allowed" }
  );

export const loginSchema = z.object({
  email: emailWithAllowedDomain,
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type LoginForm = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: emailWithAllowedDomain,
    password: z.string().min(8, "Password must be at least 8 characters long"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: emailWithAllowedDomain,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const codeVerification = z.object({
  email: emailWithAllowedDomain,
  code: z.string().length(6, "Verification code must be 6 characters long"),
});

export type CodeVerificationInput = z.infer<typeof codeVerification>;

export const resetPasswordSchema = z
  .object({
    verify_token: z
      .string()
      .min(1, "Verification token is required")
      .max(255, "Verification token is too long"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    password_confirmation: z
      .string()
      .min(8, "Password confirmation must be at least 8 characters long"),
  })
  .refine(
    (data) => {
      return data.password === data.password_confirmation;
    },
    { message: "Passwords do not match", path: ["password_confirmation"] }
  );

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
