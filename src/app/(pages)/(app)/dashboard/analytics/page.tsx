"use client";

import { useMemo, useState } from "react";
import {
	useAnalyticsOverviewQuery,
	useClicksOverTimeQuery,
	useRecentClicksQuery,
} from "@/hooks";
import { getBackendMessage } from "@/lib";
import {
	FiLink,
	FiMousePointer,
	FiTrendingUp,
	FiGlobe,
	FiClock,
	FiBarChart,
	FiArrowUpRight,
	FiTrendingDown,
	FiUsers,
	FiActivity,
	FiZap,
} from "react-icons/fi";
import {
	BarChart,
	Bar,
	Line,
	AreaChart,
	Area,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	ComposedChart,
} from "recharts";

// Custom Tooltip
interface TooltipPayload {
	name: string;
	value: number;
	color: string;
}

interface CustomTooltipProps {
	active?: boolean;
	payload?: TooltipPayload[];
	label?: string;
}

interface PieLabelProps {
	name?: string | undefined;
	percent?: number;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
	if (active && payload && payload.length) {
		return (
			<div className="rounded-xl bg-gray-900 p-3 shadow-2xl border border-gray-700/50">
				<p className="text-sm font-bold text-white mb-1">{label}</p>
				{payload.map((entry, index: number) => (
					<p
						key={index}
						style={{ color: entry.color }}
						className="text-sm font-semibold"
					>
						{entry.name}: {entry.value}
					</p>
				))}
			</div>
		);
	}
	return null;
};

export default function AnalyticsPage() {
	const [period, setPeriod] = useState<"week" | "month" | "year">("week");

	const {
		data: overview,
		isLoading: overviewLoading,
		isError: overviewError,
		error: overviewErrorObj,
	} = useAnalyticsOverviewQuery();
	const { data: clicksData, isLoading: clicksLoading } =
		useClicksOverTimeQuery({ period });
	const { data: recentClicks, isLoading: recentLoading } =
		useRecentClicksQuery();

	const chartData = useMemo(() => {
		if (!clicksData?.clicks_over_time) return [];
		return clicksData.clicks_over_time.map((item) => ({
			date: new Date(item.date).toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
			}),
			clicks: item.clicks,
		}));
	}, [clicksData]);

	const cumulativeData = useMemo(() => {
		return chartData.reduce(
			(acc, item, index) => {
				const cumulative = (acc[index - 1]?.cumulative ?? 0) + item.clicks;
				acc.push({ ...item, cumulative });
				return acc;
			},
			[] as (typeof chartData[0] & { cumulative: number })[]
		);
	}, [chartData]);

	const referrerData = useMemo(() => {
		if (!overview?.top_referrers) return [];
		return overview.top_referrers.slice(0, 6).map((ref) => ({
			name: ref.referrer || "Direct",
			value: ref.total,
		}));
	}, [overview]);

	const CHART_COLORS = [
		"#6366f1", // indigo
		"#8b5cf6", // violet
		"#06b6d4", // cyan
		"#f59e0b", // amber
		"#ec4899", // pink
		"#10b981", // emerald
	];

	const maxClicks = Math.max(...(chartData.map((d) => d.clicks) || [0]));
	const avgClicks = useMemo(() => {
		if (chartData.length === 0) return 0;
		return Math.round(
			chartData.reduce((sum, item) => sum + item.clicks, 0) / chartData.length
		);
	}, [chartData]);

	return (
		<div className="space-y-8 pb-8">
			{/* Header */}
			<div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-600 via-violet-600 to-purple-700 p-8 md:p-10 shadow-2xl">
				<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTMwVjBoLTEydjRoMTJ6TTI0IDI0aDEydi0xMkgyNHYxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
				<div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
				<div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-indigo-300/20 blur-3xl" />
				<div className="relative flex items-center justify-between">
					<div>
						<div className="flex items-center gap-3 mb-2">
							<div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
								<FiBarChart className="h-5 w-5 text-white" />
							</div>
							<span className="text-indigo-200 text-sm font-semibold uppercase tracking-wider">Dashboard</span>
						</div>
						<h1 className="text-4xl md:text-5xl font-black text-white">
							Analytics
						</h1>
						<p className="text-indigo-200 font-medium mt-2 text-lg">
							Real-time insights into your link performance
						</p>
					</div>
					<FiZap className="hidden md:block h-20 w-20 text-white/10" />
				</div>
			</div>

			{/* Error State */}
			{overviewError && (
				<div className="rounded-2xl bg-linear-to-br from-red-50 to-rose-50 border border-red-200/60 p-6 shadow-sm">
					<p className="text-red-700 font-semibold flex items-center gap-2">
						<FiTrendingDown className="h-5 w-5" />
						{getBackendMessage(overviewErrorObj, "Failed to load analytics")}
					</p>
				</div>
			)}

			{/* Loading State */}
			{overviewLoading ? (
				<div className="flex items-center justify-center py-20">
					<div className="text-center space-y-4">
						<div className="relative inline-flex">
							<div className="h-14 w-14 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
						</div>
						<p className="text-gray-500 font-medium">Crunching your numbers...</p>
					</div>
				</div>
			) : overview ? (
				<>
					{/* Stat Cards */}
					<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
						{[
							{
								label: "Total Links",
								value: overview.total_links,
								Icon: FiLink,
								gradient: "from-indigo-500 to-indigo-600",
								bgLight: "bg-indigo-50",
								iconColor: "text-indigo-600",
								ring: "ring-indigo-100",
							},
							{
								label: "Active Links",
								value: overview.active_link,
								Icon: FiActivity,
								gradient: "from-emerald-500 to-teal-600",
								bgLight: "bg-emerald-50",
								iconColor: "text-emerald-600",
								ring: "ring-emerald-100",
							},
							{
								label: "Total Clicks",
								value: overview.total_clicks,
								Icon: FiMousePointer,
								gradient: "from-violet-500 to-purple-600",
								bgLight: "bg-violet-50",
								iconColor: "text-violet-600",
								ring: "ring-violet-100",
							},
							{
								label: "Avg Clicks/Link",
								value:
									overview.total_links > 0
										? Math.round(overview.total_clicks / overview.total_links)
										: 0,
								Icon: FiBarChart,
								gradient: "from-amber-500 to-orange-500",
								bgLight: "bg-amber-50",
								iconColor: "text-amber-600",
								ring: "ring-amber-100",
							},
						].map((stat, idx) => (
							<div
								key={idx}
								className={`group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ${stat.ring} hover:shadow-lg transition-all duration-300`}
							>
								<div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${stat.gradient}`} />
								<div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-linear-to-br opacity-[0.06]" />

								<div className="relative space-y-4">
									<div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl ${stat.bgLight} group-hover:scale-110 transition-transform`}>
										<stat.Icon className={`h-6 w-6 ${stat.iconColor}`} />
									</div>
									<div>
										<p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
											{stat.label}
										</p>
										<p className="text-3xl font-black text-gray-900 mt-1">
											{stat.value.toLocaleString()}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Best Performing Link */}
					{overview?.best_performing_link && (
						<div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-amber-50 via-orange-50 to-rose-50 border border-amber-200/40 p-8 shadow-sm">
							<div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-amber-200/20 blur-3xl" />
							<div className="flex items-start justify-between gap-6">
								<div className="flex-1">
									<div className="flex items-center gap-3 mb-4">
										<div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/25">
											<FiArrowUpRight className="h-6 w-6 text-white" />
										</div>
										<div>
											<h3 className="text-lg font-bold text-gray-900">
												Best Performer
											</h3>
											<p className="text-sm text-amber-600 font-medium">Top performing link</p>
										</div>
									</div>
									<p className="text-2xl font-black text-gray-900 mb-4">
										{overview.best_performing_link.title}
									</p>
									<div className="flex items-center gap-6">
										<div className="bg-white/80 rounded-xl px-4 py-3 border border-amber-200/50">
											<p className="text-xs text-gray-500 font-semibold uppercase">Clicks</p>
											<p className="text-2xl font-bold text-gray-900">
												{overview.best_performing_link.clicks}
											</p>
										</div>
										<div className="bg-white/80 rounded-xl px-4 py-3 border border-amber-200/50">
											<p className="text-xs text-gray-500 font-semibold uppercase">Short Code</p>
											<code className="text-lg font-mono font-bold text-indigo-600">
												/{overview.best_performing_link.short_code}
											</code>
										</div>
									</div>
								</div>
								<div className="hidden md:flex items-center justify-center h-20 w-20 rounded-2xl bg-amber-100/50 text-4xl">
									ðŸ†
								</div>
							</div>
						</div>
					)}

					{/* Charts Section */}
					<div className="grid gap-6 lg:grid-cols-2">
						{/* Bar Chart */}
						<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 hover:shadow-lg transition-shadow">
							<div className="space-y-6">
								<div>
									<h3 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-4">
										<div className="h-9 w-9 rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
											<FiBarChart className="h-4 w-4 text-white" />
										</div>
										Clicks Over Time
									</h3>
									<div className="flex gap-2 mb-4">
										{(["week", "month", "year"] as const).map((p) => (
											<button
												key={p}
												onClick={() => setPeriod(p)}
												className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
													period === p
														? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
														: "bg-gray-100 text-gray-600 hover:bg-gray-200"
												}`}
											>
												{p === "week"
													? "Week"
													: p === "month"
														? "Month"
														: "Year"}
											</button>
										))}
									</div>
								</div>

								{clicksLoading ? (
									<div className="flex items-center justify-center h-72">
										<div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
									</div>
								) : chartData.length > 0 ? (
									<ResponsiveContainer width="100%" height={280}>
										<BarChart data={chartData}>
											<defs>
												<linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
													<stop offset="5%" stopColor="#6366f1" stopOpacity={0.9} />
													<stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.4} />
												</linearGradient>
											</defs>
											<CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
											<XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: "12px" }} />
											<YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
											<Tooltip content={<CustomTooltip />} />
											<Bar dataKey="clicks" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
										</BarChart>
									</ResponsiveContainer>
								) : (
									<div className="flex items-center justify-center h-72 text-gray-400">
										No data available
									</div>
								)}
							</div>
						</div>

						{/* Area Chart */}
						<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 hover:shadow-lg transition-shadow">
							<div className="space-y-6">
								<h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
									<div className="h-9 w-9 rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
										<FiTrendingUp className="h-4 w-4 text-white" />
									</div>
									Cumulative Growth
								</h3>

								{clicksLoading ? (
									<div className="flex items-center justify-center h-72">
										<div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
									</div>
								) : cumulativeData.length > 0 ? (
									<ResponsiveContainer width="100%" height={280}>
										<AreaChart data={cumulativeData}>
											<defs>
												<linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
													<stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
													<stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
												</linearGradient>
											</defs>
											<CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
											<XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: "12px" }} />
											<YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
											<Tooltip content={<CustomTooltip />} />
											<Area
												type="monotone"
												dataKey="cumulative"
												stroke="#10b981"
												fill="url(#areaGradient)"
												strokeWidth={2.5}
											/>
										</AreaChart>
									</ResponsiveContainer>
								) : (
									<div className="flex items-center justify-center h-72 text-gray-400">
										No data available
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Detailed Trend Analysis */}
					<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 hover:shadow-lg transition-shadow">
						<div className="space-y-4">
							<h3 className="text-lg font-bold text-gray-900 flex items-center gap-3">
								<div className="h-9 w-9 rounded-lg bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-violet-500/20">
									<FiActivity className="h-4 w-4 text-white" />
								</div>
								Detailed Trend Analysis
							</h3>

							<div className="grid grid-cols-3 gap-4 mb-6">
								{[
									{ label: "Peak", value: maxClicks, color: "from-rose-500 to-pink-600", bg: "bg-rose-50", text: "text-rose-700" },
									{ label: "Average", value: avgClicks, color: "from-indigo-500 to-violet-600", bg: "bg-indigo-50", text: "text-indigo-700" },
									{ label: "Total", value: chartData.reduce((sum, d) => sum + d.clicks, 0), color: "from-amber-500 to-orange-500", bg: "bg-amber-50", text: "text-amber-700" },
								].map((item, idx) => (
									<div key={idx} className={`relative overflow-hidden rounded-xl ${item.bg} p-4 ring-1 ring-inset ring-gray-900/5`}>
										<div className={`absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r ${item.color}`} />
										<p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.label}</p>
										<p className={`text-2xl font-black ${item.text} mt-2`}>{item.value}</p>
									</div>
								))}
							</div>

							{clicksLoading ? (
								<div className="flex items-center justify-center h-72">
									<div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
								</div>
							) : chartData.length > 0 ? (
								<ResponsiveContainer width="100%" height={300}>
									<ComposedChart data={chartData}>
										<defs>
											<linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
												<stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6} />
												<stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
											</linearGradient>
										</defs>
										<CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
										<XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: "12px" }} />
										<YAxis stroke="#94a3b8" style={{ fontSize: "12px" }} />
										<Tooltip content={<CustomTooltip />} />
										<Bar dataKey="clicks" fill="#ede9fe" opacity={0.7} radius={[8, 8, 0, 0]} />
										<Line
											type="monotone"
											dataKey="clicks"
											stroke="#7c3aed"
											strokeWidth={3}
											dot={{ fill: "#7c3aed", r: 5, strokeWidth: 2, stroke: "#fff" }}
											activeDot={{ r: 7, fill: "#7c3aed" }}
										/>
									</ComposedChart>
								</ResponsiveContainer>
							) : (
								<div className="flex items-center justify-center h-72 text-gray-400">
									No data available
								</div>
							)}
						</div>
					</div>

					{/* Pie Chart & Referrers */}
					{overview?.top_referrers && overview.top_referrers.length > 0 && (
						<div className="grid gap-6 lg:grid-cols-2">
							{/* Pie Chart */}
							<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 hover:shadow-lg transition-shadow">
								<h3 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-6">
									<div className="h-9 w-9 rounded-lg bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
										<FiGlobe className="h-4 w-4 text-white" />
									</div>
									Traffic Distribution
								</h3>

								<ResponsiveContainer width="100%" height={280}>
									<PieChart>
										<Pie
											data={referrerData}
											cx="50%"
											cy="50%"
											labelLine={false}
											label={({ name, percent }: PieLabelProps) =>
												`${(name ?? "Unknown").substring(0, 12)}: ${((percent ?? 0) * 100).toFixed(0)}%`
											}
											outerRadius={80}
											fill="#8884d8"
											dataKey="value"
										>
											{referrerData.map((_, index) => (
												<Cell
													key={`cell-${index}`}
													fill={CHART_COLORS[index % CHART_COLORS.length]}
												/>
											))}
										</Pie>
										<Tooltip
											formatter={(value) => `${value} clicks`}
											contentStyle={{
												backgroundColor: "#1e293b",
												border: "none",
												borderRadius: "12px",
												color: "#fff",
												boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
											}}
										/>
									</PieChart>
								</ResponsiveContainer>
							</div>

							{/* Referrer List */}
							<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 hover:shadow-lg transition-shadow">
								<h3 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-6">
									<div className="h-9 w-9 rounded-lg bg-linear-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-md shadow-pink-500/20">
										<FiUsers className="h-4 w-4 text-white" />
									</div>
									Top Referrers
								</h3>

								<div className="space-y-4">
									{overview.top_referrers.map((referrer, idx) => {
										const percentage = Math.round(
											(referrer.total /
												Math.max(
													...overview.top_referrers.map((r) => r.total)
												)) *
												100
										);
										return (
											<div key={idx} className="group">
												<div className="flex items-center justify-between mb-2">
													<div className="flex items-center gap-2.5 min-w-0">
														<div
															className="w-3 h-3 rounded-full shrink-0"
															style={{
																backgroundColor: CHART_COLORS[idx % CHART_COLORS.length],
															}}
														/>
														<p className="text-sm font-semibold text-gray-700 truncate">
															{referrer.referrer || "Direct"}
														</p>
													</div>
													<p className="text-sm font-bold text-gray-900 tabular-nums">
														{referrer.total}
													</p>
												</div>
												<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
													<div
														className="h-full rounded-full transition-all duration-700 ease-out"
														style={{
															width: `${percentage}%`,
															backgroundColor: CHART_COLORS[idx % CHART_COLORS.length],
														}}
													/>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					)}

					{/* Recent Activity */}
					<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 hover:shadow-lg transition-shadow">
						<div>
							<h3 className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-1">
								<div className="h-9 w-9 rounded-lg bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md shadow-amber-500/20">
									<FiClock className="h-4 w-4 text-white" />
								</div>
								Recent Activity
							</h3>
							<p className="text-sm text-gray-500 mb-6 ml-12">
								Last 10 clicks across all links
							</p>

							{recentLoading ? (
								<div className="flex items-center justify-center py-16">
									<div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600" />
								</div>
							) : recentClicks && recentClicks.length > 0 ? (
								<div className="space-y-3">
									{recentClicks.slice(0, 10).map((click, idx) => {
										const colors = [
											{ bg: "bg-indigo-50", icon: "from-indigo-500 to-violet-600", ring: "ring-indigo-100" },
											{ bg: "bg-emerald-50", icon: "from-emerald-500 to-teal-600", ring: "ring-emerald-100" },
											{ bg: "bg-amber-50", icon: "from-amber-500 to-orange-500", ring: "ring-amber-100" },
											{ bg: "bg-rose-50", icon: "from-rose-500 to-pink-600", ring: "ring-rose-100" },
											{ bg: "bg-violet-50", icon: "from-violet-500 to-purple-600", ring: "ring-violet-100" },
										];
										const c = colors[idx % colors.length];

										return (
											<div
												key={click.id}
												className={`group/item rounded-xl p-4 ${c.bg} ring-1 ${c.ring} hover:shadow-md transition-all`}
											>
												<div className="flex items-center justify-between gap-4">
													<div className="flex items-center gap-4 flex-1 min-w-0">
														<div className={`h-10 w-10 rounded-xl bg-linear-to-br ${c.icon} flex items-center justify-center shadow-md shrink-0`}>
															<FiMousePointer className="h-5 w-5 text-white" />
														</div>
														<div className="min-w-0 flex-1">
															<p className="font-bold text-gray-900 truncate text-sm">
																{click.link.title}
															</p>
															<p className="text-xs text-gray-500 mt-0.5">
																{click.city}, {click.country}
															</p>
														</div>
													</div>

													<div className="flex gap-2 shrink-0">
														<span className="hidden sm:inline-flex px-2.5 py-1 rounded-lg bg-white/80 text-xs font-semibold text-gray-600 ring-1 ring-gray-200/50">
															{click.browser}
														</span>
														<span className="hidden sm:inline-flex px-2.5 py-1 rounded-lg bg-white/80 text-xs font-semibold text-gray-600 ring-1 ring-gray-200/50">
															{click.platform}
														</span>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							) : (
								<div className="flex flex-col items-center justify-center py-12 text-gray-400">
									<FiMousePointer className="h-12 w-12 opacity-20 mb-3" />
									<p className="font-medium">No recent clicks yet</p>
								</div>
							)}
						</div>
					</div>
				</>
			) : null}
		</div>
	);
}
