"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordInput } from "@/schemas";
import { Button, FormField } from "@/components/ui";
import { FiLock } from "react-icons/fi";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getBackendMessage, showToast } from "@/lib";
import { useResetPasswordMutation } from "@/hooks";
import { usePreventBackNavigation } from "@/hooks";

export function ChangePasswordForm() {
	usePreventBackNavigation();
	const router = useRouter();
	const searchParams = useSearchParams();
	const verifyToken = searchParams.get("verify_token") ?? "";

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ResetPasswordInput>({
		resolver: zodResolver(resetPasswordSchema),
		mode: "onChange",
		defaultValues: {
			verify_token: verifyToken,
		},
	});

	useEffect(() => {
		if (!verifyToken) {
			showToast({
				state: "error",
				title: "Missing token",
				description: "Please verify your code first.",
			});
			router.replace("/auth/verify-otp");
		}
	}, [verifyToken, router]);

	const { mutate, isPending } = useResetPasswordMutation({
		onSuccess: ({ message }) => {
			showToast({
				state: "success",
				title: "Password updated",
				description: message,
			});
			router.push("/auth/login");
		},
		onError: (error) => {
			const message = getBackendMessage(error, "Password reset failed.");
			showToast({
				state: "error",
				title: "Reset failed",
				description: message,
			});
		},
	});

	const onSubmit = (data: ResetPasswordInput) => {
		mutate(data);
	};

	return (
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-b from-teal-light/30 via-white to-white p-4">
			<div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-teal-light/30 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-teal/20 blur-3xl" />

			<div className="relative w-full max-w-md space-y-7 rounded-3xl border border-teal/15 bg-white/90 p-8 shadow-[0_20px_60px_-30px_rgba(13,122,138,0.6)] backdrop-blur">
				<div className="space-y-3 text-center">
					<span className="inline-flex items-center rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal">
						New password
					</span>
					<h1 className="text-3xl font-semibold text-gray-900">
						Set a new password
					</h1>
					<p className="text-sm text-gray-500">
						Choose a strong password for your account.
					</p>
				</div>

				<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
					<input type="hidden" {...register("verify_token")} defaultValue={verifyToken} />
					<FormField
						type="password"
						label="New Password"
						placeholder="******"
						error={errors.password?.message}
						fullWidth
						autoComplete="new-password"
						variant="underline"
						leftIcon={FiLock}
						{...register("password")}
					/>

					<FormField
						type="password"
						label="Confirm Password"
						placeholder="******"
						error={errors.password_confirmation?.message}
						fullWidth
						autoComplete="new-password"
						variant="underline"
						leftIcon={FiLock}
						{...register("password_confirmation")}
					/>

					<Button type="submit" fullWidth size="lg" isLoading={isPending} disabled={isPending}>
						Reset password
					</Button>
				</form>

				<p className="text-center text-sm text-gray-500">
					Remembered your password?{" "}
					<Link href="/auth/login" className="font-semibold text-teal">
						Back to login
					</Link>
				</p>
			</div>
		</div>
	);
}
