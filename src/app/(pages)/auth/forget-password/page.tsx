"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/schemas";
import { Button, FormField } from "@/components/ui";
import { FiMail } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { getBackendMessage, showToast } from "@/lib";
import { useForgotPasswordMutation } from "@/hooks";
import { usePreventBackNavigation } from "@/hooks";

export default function ForgotPassword() {
  usePreventBackNavigation();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });
  const { mutate, isPending } = useForgotPasswordMutation({
    onSuccess: ({ message }, email) => {
      showToast({
        state: "success",
        title: "Check your email",
        description: message,
      });
      router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
    },
    onError: (error) => {
      const message = getBackendMessage(error, "Failed to send reset email.");
      showToast({
        state: "error",
        title: "Request failed",
        description: message,
      });
    },
  });

  const onSubmit = (data: ForgotPasswordInput) => {
    mutate(data.email);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-b from-teal-100/40 via-white to-white p-4">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-teal-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />

      <div className="relative w-full max-w-md space-y-7 rounded-3xl border border-teal-200/40 bg-white/90 p-8 shadow-2xl shadow-teal-600/15 backdrop-blur">
        <div className="space-y-3 text-center">
          <span className="inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-600">
            Reset password
          </span>
          <h1 className="text-3xl font-semibold text-gray-900">
            Forgot your password?
          </h1>
          <p className="text-sm text-gray-500">
            Enter your email and we will send you a reset link.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <FormField
            type="text"
            label="Email"
            placeholder="email@example.com"
            error={errors.email?.message}
            fullWidth
            autoComplete="email"
            variant="underline"
            leftIcon={FiMail}
            {...register("email")}
          />

          <Button type="submit" fullWidth size="lg" isLoading={isPending} disabled={isPending}>
            Send reset link
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Remembered your password?{" "}
          <Link href="/auth/login" className="font-semibold text-teal-600 hover:text-teal-700">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
