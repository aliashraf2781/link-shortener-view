"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
    FiLink,
    FiBarChart2,
    // FiSettings,
    FiMenu,
    FiX,
    FiLogOut,
    FiUser,
} from "react-icons/fi";
import { signOut, useSession } from "next-auth/react";

type NavItem = {
    label: string;
    href: string;
    icon: React.ElementType;
};

const navItems: NavItem[] = [
    { label: "Links", href: "/dashboard", icon: FiLink },
    { label: "Analytics", href: "/dashboard/analytics", icon: FiBarChart2 },
    // { label: "Settings", href: "/dashboard/settings", icon: FiSettings },
];

type DashboardLayoutProps = {
    children: React.ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    const handleSignOut = async () => {
        await signOut({ callbackUrl: "/auth/login" });
    };

    return (
        <div className="flex h-screen bg-linear-to-br from-white via-blue-50/30 to-teal-50/20">
            {/* Mobile overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-30 w-64 transform bg-linear-to-b from-white to-blue-50/40 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
                    "lg:shadow-none shadow-2xl",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Logo */}
                    <div className="flex h-16 items-center justify-between px-6 pt-4">
                        <Link href="/dashboard" className="flex items-center gap-2 group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg">
                                <Image
                                    src="/logo.svg"
                                    alt="LinkShort Logo"
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-contain"
                                    priority
                                />
                            </div>
                            <span className="text-xl font-bold bg-linear-to-r from-teal-700 to-teal-600 bg-clip-text text-transparent">
                                LinkShort
                            </span>
                        </Link>
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FiX className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2 px-3 py-6">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-linear-to-r from-teal/15 to-teal/5 text-teal shadow-sm"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-white/40"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                        {/* Footer section with logout */}
                    </nav>
                    <div className="mt-auto border-t border-teal-800/10 pt-4 pb-6 px-3 space-y-3">
                        {/* User Info */}
                        {session?.user && (
                            <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-teal-600/5 border border-teal-200/10">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-teal-300 to-teal-600 text-white font-semibold">
                                    {session.user.email?.charAt(0).toUpperCase() || <FiUser className="h-5 w-5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                        {session.user.name || "User"}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {session.user.email}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Logout Button */}
                        <button
                            onClick={handleSignOut}
                            className={cn(
                                "flex w-full items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
                                "bg-linear-to-r from-red-500/10 to-pink-500/10 text-red-700 hover:from-red-500/20 hover:to-pink-500/20",
                                "border border-red-200/50 hover:border-red-300/70",
                                "shadow-sm hover:shadow-md",
                                "group"
                            )}
                            title="Sign out from your account"
                        >
                            <FiLogOut className="h-5 w-5 group-hover:scale-110 transition-transform" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header */}
                <header className="flex h-16 items-center justify-between px-6 bg-white/40 backdrop-blur-xl">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <FiMenu className="h-6 w-6" />
                    </button>

                    <div className="flex items-center gap-4 lg:ml-0">
                        <h1 className="text-xl font-semibold text-gray-900">
                            {navItems.find((item) => item.href === pathname)?.label ||
                                "Dashboard"}
                        </h1>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
        </div>
    );
}
