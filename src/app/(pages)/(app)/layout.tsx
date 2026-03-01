import { DashboardLayout } from "@/components/core";

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return <DashboardLayout>{children}</DashboardLayout>;
}
