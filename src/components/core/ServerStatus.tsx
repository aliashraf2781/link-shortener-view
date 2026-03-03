"use client";
import { useEffect, useState } from "react";
import { FiCheck, FiX, FiClock } from "react-icons/fi";

interface ServerHealth {
    backend: {
        status: "connected" | "disconnected" | "loading";
        responseTime: number | null;
        lastChecked: Date | null;
    };
}

export function ServerStatus() {
    const [health, setHealth] = useState<ServerHealth>({
        backend: {
            status: "loading",
            responseTime: null,
            lastChecked: null,
        },
    });

    useEffect(() => {
        const checkServer = async () => {
            try {
                const startTime = performance.now();
                await fetch(process.env.NEXT_PUBLIC_API_URL || "", {
                    // params: { url: process.env.NEXT_PUBLIC_API_URL },
                    // timeout: 5000,
                });
                const endTime = performance.now();
                const responseTime = Math.round(endTime - startTime);

                setHealth({
                    backend: {
                        status: "connected",
                        responseTime,
                        lastChecked: new Date(),
                    },
                });
            } catch {
                setHealth((prev) => ({
                    ...prev,
                    backend: {
                        status: "disconnected",
                        responseTime: null,
                        lastChecked: new Date(),
                    },
                }));
            }
        };

        checkServer();
        const interval = setInterval(checkServer, 30000);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "connected":
                return "border-green-200 bg-white/80 backdrop-blur";
            case "disconnected":
                return "border-red-200 bg-red-50/40 backdrop-blur";
            case "loading":
                return "border-yellow-200 bg-yellow-50/40 backdrop-blur";
            default:
                return "border-gray-200 bg-white/80 backdrop-blur";
        }
    };

    const getIndicatorColor = (status: string) => {
        switch (status) {
            case "connected":
                return "bg-green-500 shadow-lg shadow-green-500/50";
            case "disconnected":
                return "bg-red-500 shadow-lg shadow-red-500/50";
            case "loading":
                return "bg-yellow-500 shadow-lg shadow-yellow-500/50";
            default:
                return "bg-gray-400";
        }
    };

    const getTextColor = (status: string) => {
        switch (status) {
            case "connected":
                return "text-green-700";
            case "disconnected":
                return "text-red-700";
            case "loading":
                return "text-yellow-700";
            default:
                return "text-gray-700";
        }
    };

    return (
        <div className={`rounded-full border px-4 py-2.5 transition-all duration-300 ${getStatusColor(health.backend.status)}`}>
            <div className="flex items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`flex items-center justify-center h-2.5 w-2.5 rounded-full ${getIndicatorColor(health.backend.status)}`}>
                        {health.backend.status === "loading" && (
                            <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                        )}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className={`text-xs sm:text-sm font-medium ${getTextColor(health.backend.status)}`}>
                            {health.backend.status === "connected" && "Backend Online"}
                            {health.backend.status === "disconnected" && "Backend Offline"}
                            {health.backend.status === "loading" && "Checking Status"}
                        </span>
                        {health.backend.responseTime && health.backend.status === "connected" && (
                            <span className="hidden sm:inline text-xs text-gray-500">
                                • {health.backend.responseTime}ms
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-center gap-0.5">
                    {health.backend.status === "connected" && <FiCheck className="h-4 w-4 text-green-600" />}
                    {health.backend.status === "disconnected" && <FiX className="h-4 w-4 text-red-600" />}
                    {health.backend.status === "loading" && <FiClock className="h-4 w-4 text-yellow-600 animate-spin" />}
                </div>
            </div>
        </div>
    );
}
