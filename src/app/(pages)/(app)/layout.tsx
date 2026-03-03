import { DashboardLayout } from "@/components/core";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Dashboard - SaaS Link Management",
	description: "Manage and monitor your shortened links with advanced analytics and insights",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return <DashboardLayout>{children}</DashboardLayout>;
}
