import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Authentication - SaaS Link Management",
	description: "Sign in or create an account to start managing your shortened links",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
