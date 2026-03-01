"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterSchema } from "@/schemas";
import { Button, FormField } from "@/components/ui";
import { FiLock, FiMail } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { getBackendMessage, showToast } from "@/lib";
import { useRegisterMutation } from "@/hooks";
import { usePreventBackNavigation } from "@/hooks";

export default function SignUp() {
    usePreventBackNavigation();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
    });
    const { mutate, isPending } = useRegisterMutation({
        onSuccess: ({ message }) => {
            showToast({
                state: "success",
                title: "Registration successful",
                description: message,
            });
            router.push("/auth/login");
        },
        onError: (error) => {
            const message = getBackendMessage(error, "An error occurred during registration.");
            showToast({
                state: "error",
                title: "Registration failed",
                description: message,
            });
        },
    });
    const onSubmit = (data: RegisterSchema) => {
        mutate({
            name: data.name,
            email: data.email,
            password: data.password,
            password_confirmation: data.password_confirmation,
        });
    };
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-linear-to-b from-teal-light/30 via-white to-white p-4">
            <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-teal-light/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-teal/20 blur-3xl" />

            <div className="relative w-full max-w-md space-y-7 rounded-3xl border border-teal/15 bg-white/90 p-8 shadow-[0_20px_60px_-30px_rgba(13,122,138,0.6)] backdrop-blur">
                <div className="space-y-3 text-center">
                    <span className="inline-flex items-center rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal">
                        Create an account
                    </span>
                    <h1 className="text-3xl font-semibold text-gray-900">
                        Sign up to your account
                    </h1>
                    <p className="text-sm text-gray-500">
                        Enter your details to create an account
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
                        type="text"
                        label="Name"
                        placeholder="John Doe"
                        error={errors.name?.message}
                        fullWidth
                        autoComplete="name"
                        variant="underline"
                        leftIcon={FiMail}
                        {...register("name")}
                    />
                    <FormField
                        type="password"
                        label="Password"
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
                        Sign Up
                    </Button>
                </form>

                <p className="text-center text-sm text-gray-500">
                    ?{" "}
                    <Link href="/auth/login" className="font-semibold text-teal">
                        Already have an account? Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}