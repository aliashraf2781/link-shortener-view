"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginForm } from "@/schemas";
import { Button, FormField } from "@/components/ui";
import { FiLock, FiMail } from "react-icons/fi";
import { getBackendMessage, showToast } from "@/lib";
import { usePreventBackNavigation } from "@/hooks";

export default function LogIn() {
  const router = useRouter();
  usePreventBackNavigation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });
  const onSubmit = async (data: LoginForm) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      const description =
        result?.error && result.error !== "CredentialsSignin"
          ? getBackendMessage(result.error, "Invalid email or password")
          : "Invalid email or password";
      showToast({
        state: "error",
        title: "login failed",
        description,
      });

      return;
    }

    router.replace("/dashboard");
    router.refresh();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-b from-teal-light/30 via-white to-white p-4">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-teal-light/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-teal/20 blur-3xl" />

      <div className="relative w-full max-w-md space-y-7 rounded-3xl border border-teal/15 bg-white/90 p-8 shadow-[0_20px_60px_-30px_rgba(13,122,138,0.6)] backdrop-blur">
        <div className="space-y-3 text-center">
          <span className="inline-flex items-center rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal">
            Welcome back
          </span>
          <h1 className="text-3xl font-semibold text-gray-900">
            Sign in to your account
          </h1>
          <p className="text-sm text-gray-500">
            Enter your credentials to access your account
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
          <FormField
            type="password"
            label="Password"
            placeholder="******"
            error={errors.password?.message}
            fullWidth
            autoComplete="current-password"
            variant="underline"
            leftIcon={FiLock}
            {...register("password")}
          />

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Keep it safe.</span>
            <Link
              href="/auth/forget-password"
              className="font-medium text-teal hover:text-teal-dark"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" fullWidth size="lg" isLoading={isSubmitting} disabled={isSubmitting}>
            Sign In
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500">
          New here?{" "}
          <Link href="/auth/register" className="font-semibold text-teal">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
