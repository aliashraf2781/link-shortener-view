"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { codeVerification, type CodeVerificationInput } from "@/schemas";
import { Button, FormField } from "@/components/ui";
import { FiLock } from "react-icons/fi";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getBackendMessage, showToast } from "@/lib";
import { useForgotPasswordMutation, useVerifyResetCodeMutation } from "@/hooks";
import { usePreventBackNavigation } from "@/hooks";

export function VerifyOtpForm() {
	usePreventBackNavigation();
	const router = useRouter();
	const searchParams = useSearchParams();
	const email = searchParams.get("email") ?? "";
	const [cooldownSeconds, setCooldownSeconds] = useState(600);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CodeVerificationInput>({
		resolver: zodResolver(codeVerification),
		mode: "onChange",
		defaultValues: {
			email,
		},
	});

	useEffect(() => {
		if (!email) {
			showToast({
				state: "error",
				title: "Missing email",
				description: "Please request a reset code first.",
			});
			router.replace("/auth/forget-password");
		}
	}, [email, router]);

	useEffect(() => {
		if (cooldownSeconds <= 0) return;
		const timerId = window.setInterval(() => {
			setCooldownSeconds((prev) => Math.max(prev - 1, 0));
		}, 1000);
		return () => window.clearInterval(timerId);
	}, [cooldownSeconds]);

	const cooldownLabel = useMemo(() => {
		const minutes = Math.floor(cooldownSeconds / 60);
		const seconds = cooldownSeconds % 60;
		return `${minutes}:${seconds.toString().padStart(2, "0")}`;
	}, [cooldownSeconds]);

	const { mutate, isPending } = useVerifyResetCodeMutation({
		onSuccess: ({ message, verify_token }) => {
			showToast({
				state: "success",
				title: "Code verified",
				description: message,
			});
			router.push(`/auth/change-password?verify_token=${encodeURIComponent(verify_token)}`);
		},
		onError: (error) => {
			const message = getBackendMessage(error, "Verification failed.");
			showToast({
				state: "error",
				title: "Verification failed",
				description: message,
			});
		},
	});

	const onSubmit = (data: CodeVerificationInput) => {
		mutate({
			email,
			code: data.code,
		});
	};

	const { mutate: resendCode, isPending: isResending } = useForgotPasswordMutation({
		onSuccess: ({ message }) => {
			showToast({
				state: "success",
				title: "Code resent",
				description: message,
			});
			setCooldownSeconds(600);
		},
		onError: (error) => {
			const message = getBackendMessage(error, "Failed to resend code.");
			showToast({
				state: "error",
				title: "Resend failed",
				description: message,
			});
		},
	});

	return (
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-b from-teal-light/30 via-white to-white p-4">
			<div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-teal-light/30 blur-3xl" />
			<div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-teal/20 blur-3xl" />

			<div className="relative w-full max-w-md space-y-7 rounded-3xl border border-teal-800/20 bg-white/90 p-8 shadow-[0_20px_60px_-30px_rgba(13,122,138,0.6)] backdrop-blur">
				<div className="space-y-3 text-center">
					<span className="inline-flex items-center rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal">
						Verify code
					</span>
					<h1 className="text-3xl font-semibold text-gray-900">
						Enter your reset code
					</h1>
					<p className="text-sm text-gray-500">
						We sent a 6-digit code to your email.
					</p>
				</div>

				<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
					<input type="hidden" {...register("email")} defaultValue={email} />
					<FormField
						type="text"
						label="Code"
						placeholder="Enter the 6-digit code"
						error={errors.code?.message}
						fullWidth
						autoComplete="one-time-code"
						variant="underline"
						leftIcon={FiLock}
						{...register("code")}
					/>

					<Button type="submit" fullWidth size="lg" isLoading={isPending} disabled={isPending}>
						Verify code
					</Button>
				</form>

				<div className="flex items-center justify-between text-sm text-gray-500">
					<span>Resend available in {cooldownLabel}</span>
					<Button
						variant="ghost"
						size="sm"
						disabled={cooldownSeconds > 0 || isResending}
						isLoading={isResending}
						onClick={() => resendCode(email)}
					>
						Resend code
					</Button>
				</div>

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
