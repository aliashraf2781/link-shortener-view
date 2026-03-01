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
			<div className="rounded-lg bg-linear-to-br from-teal-900 to-teal-800 p-3 shadow-2xl border border-teal-700 backdrop-blur-sm">
				<p className="text-sm font-bold text-white">{label}</p>
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
	const [period, setPeriod] = useState<"weekly" | "monthly" | "year">(
		"weekly"
	);

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

	// Process chart data
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

	// Calculate cumulative
	const cumulativeData = useMemo(() => {
		return chartData.reduce(
			(acc, item, index) => {
				const cumulative = (acc[index - 1]?.cumulative ?? 0) + item.clicks;
				acc.push({
					...item,
					cumulative,
				});
				return acc;
			},
			[] as (typeof chartData[0] & { cumulative: number })[]
		);
	}, [chartData]);

	// Prepare referrer data
	const referrerData = useMemo(() => {
		if (!overview?.top_referrers) return [];
		return overview.top_referrers.slice(0, 6).map((ref) => ({
			name: ref.referrer || "Direct",
			value: ref.total,
		}));
	}, [overview]);

	// Elegant teal-based color palette
	const CHART_COLORS = [
		"#0d9488",
		"#14b8a6",
		"#2dd4bf",
		"#5eead4",
		"#99f6e4",
		"#ccfbf1",
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
			{/* Elegant Header */}
			<div className="relative">
				<div className="absolute inset-0 bg-linear-to-r from-teal-500/10 via-teal-400/5 to-transparent rounded-3xl blur-3xl" />
				<div className="relative space-y-2">
					<h1 className="text-5xl font-black text-gradient">
						Analytics
					</h1>
					<p className="text-lg text-gray-600 font-medium">
						Monitor your link performance with real-time insights
					</p>
				</div>
			</div>

			{/* Error State */}
			{overviewError && (
				<div className="card-lg bg-linear-to-br from-red-50 to-orange-50 border-red-200/50">
					<p className="text-red-700 font-semibold flex items-center gap-2">
						<FiTrendingDown className="h-5 w-5" />
						{getBackendMessage(overviewErrorObj, "Failed to load analytics")}
					</p>
				</div>
			)}

			{/* Loading State */}
			{overviewLoading ? (
				<div className="flex items-center justify-center py-20">
					<div className="text-center space-y-3">
						<div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600" />
						<p className="text-gray-600 font-medium">Loading analytics...</p>
					</div>
				</div>
			) : overview ? (
				<>
					{/* Stat Cards - Elegant Teal Theme */}
					<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
						{[
							{
								label: "Total Links",
								value: overview.total_links,
								Icon: FiLink,
								bgGradient: "from-teal-50 to-teal-100/50",
								iconBg: "from-teal-200 to-teal-300",
								accentColor: "text-teal-700",
							},
							{
								label: "Active Links",
								value: overview.active_link,
								Icon: FiActivity,
								bgGradient: "from-teal-50/80 to-cyan-50",
								iconBg: "from-cyan-200 to-cyan-300",
								accentColor: "text-teal-600",
							},
							{
								label: "Total Clicks",
								value: overview.total_clicks,
								Icon: FiMousePointer,
								bgGradient: "from-teal-100/30 to-teal-50/50",
								iconBg: "from-teal-300 to-teal-400",
								accentColor: "text-teal-800",
							},
							{
								label: "Avg Clicks/Link",
								value:
									overview.total_links > 0
										? Math.round(
												overview.total_clicks / overview.total_links
										  )
										: 0,
								Icon: FiBarChart,
								bgGradient: "from-teal-50 to-cyan-50/30",
								iconBg: "from-teal-300 to-cyan-300",
								accentColor: "text-teal-700",
							},
						].map((stat, idx) => (
							<div
								key={idx}
								className="group stat-box bg-linear-to-br"
								style={{
									backgroundImage: `linear-gradient(to bottom right, #f0fdfa, #ccfbf1)`,
								}}
							>
								{/* Background glow */}
								<div className="absolute -right-8 -top-8 h-24 w-24 bg-teal-300 opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity" />

								<div className="relative space-y-3">
									{/* Icon Box */}
									<div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-linear-to-br from-teal-200 to-teal-300 shadow-lg group-hover:scale-110 transition-transform">
										<stat.Icon className="h-6 w-6 text-teal-700" />
									</div>

									{/* Content */}
									<div>
										<p className="text-xs font-semibold text-teal-600 uppercase tracking-wider">
											{stat.label}
										</p>
										<p className="text-4xl font-black text-teal-900 mt-2">
											{stat.value.toLocaleString()}
										</p>
									</div>

									{/* Accent line */}
									<div className="h-1 w-12 bg-linear-to-r from-teal-400 to-teal-300 rounded-full" />
								</div>
							</div>
						))}
					</div>

					{/* Best Performing Link */}
					{overview?.best_performing_link && (
						<div className="card-lg bg-linear-to-br from-teal-50 to-teal-100/50 border-teal-200/30">
							<div className="flex items-start justify-between gap-6">
								<div className="flex-1">
									<div className="flex items-center gap-3 mb-4">
										<div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-linear-to-br from-teal-300 to-teal-400 shadow-lg">
											<FiArrowUpRight className="h-6 w-6 text-white" />
										</div>
										<h3 className="text-lg font-bold text-teal-900">
											Best Performer
										</h3>
									</div>
									<p className="text-2xl font-black text-teal-700 mb-4">
										{overview.best_performing_link.title}
									</p>
									<div className="flex items-center gap-6">
										<div>
											<p className="text-sm text-teal-600 font-semibold">
												Clicks
											</p>
											<p className="text-2xl font-bold text-teal-900">
												{
													overview.best_performing_link
														.clicks
												}
											</p>
										</div>
										<div className="h-12 w-px bg-teal-200/50" />
										<div>
											<p className="text-sm text-teal-600 font-semibold">
												Short Code
											</p>
											<code className="text-lg font-mono font-bold text-teal-600">
												/
												{
													overview.best_performing_link
														.short_code
												}
											</code>
										</div>
									</div>
								</div>
								<div className="text-5xl font-black text-teal-200/40">
									★
								</div>
							</div>
						</div>
					)}

					{/* Charts Section */}
					<div className="grid gap-6 lg:grid-cols-2">
						{/* Bar Chart */}
						<div className="card-lg">
							<div className="space-y-6">
								<div>
									<h3 className="text-lg font-bold text-teal-900 flex items-center gap-2 mb-4">
										<div className="h-8 w-8 rounded-lg bg-linear-to-br from-teal-300 to-teal-400 flex items-center justify-center">
										<FiBarChart className="h-4 w-4 text-white" />
										</div>
										Clicks Over Time
									</h3>
									<div className="flex gap-2 mb-4">
										{(
											[
												"weekly",
												"monthly",
												"year",
											] as const
										).map((p) => (
											<button
												key={p}
												onClick={() => setPeriod(p)}
												className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
													period === p
														? "bg-linear-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-600/30"
														: "bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200"
												}`}
											>
												{p === "weekly"
													? "Week"
													: p === "monthly"
														? "Month"
														: "Year"}
											</button>
										))}
									</div>
								</div>

								{clicksLoading ? (
									<div className="flex items-center justify-center h-72">
										<div className="text-center">
											<div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600 mb-3" />
											<p className="text-teal-600 font-medium">
												Loading...
											</p>
										</div>
									</div>
								) : chartData.length > 0 ? (
									<ResponsiveContainer width="100%" height={280}>
										<BarChart data={chartData}>
											<defs>
												<linearGradient
													id="barGradient"
													x1="0"
													y1="0"
													x2="0"
													y2="1"
												>
													<stop
														offset="5%"
														stopColor="#0d9488"
														stopOpacity={0.9}
													/>
													<stop
														offset="95%"
														stopColor="#14b8a6"
														stopOpacity={0.3}
													/>
												</linearGradient>
											</defs>
											<CartesianGrid
												strokeDasharray="3 3"
												stroke="#ccfbf1"
												vertical={false}
											/>
											<XAxis
												dataKey="date"
												stroke="#0f766e"
												style={{ fontSize: "12px" }}
											/>
											<YAxis
												stroke="#0f766e"
												style={{ fontSize: "12px" }}
											/>
											<Tooltip
												content={<CustomTooltip />}
											/>
											<Bar
												dataKey="clicks"
												fill="url(#barGradient)"
												radius={[8, 8, 0, 0]}
											/>
										</BarChart>
									</ResponsiveContainer>
								) : (
									<div className="flex items-center justify-center h-72 text-teal-600">
										No data available
									</div>
								)}
							</div>
						</div>

						{/* Area Chart */}
						<div className="card-lg">
							<div className="space-y-6">
								<h3 className="text-lg font-bold text-teal-900 flex items-center gap-2">
									<div className="h-8 w-8 rounded-lg bg-linear-to-br from-teal-200 to-teal-300 flex items-center justify-center">
										<FiTrendingUp className="h-4 w-4 text-teal-700" />
									</div>
									Cumulative Growth
								</h3>

								{clicksLoading ? (
									<div className="flex items-center justify-center h-72">
										<div className="text-center">
											<div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600 mb-3" />
											<p className="text-teal-600 font-medium">
												Loading...
											</p>
										</div>
									</div>
								) : cumulativeData.length > 0 ? (
									<ResponsiveContainer width="100%" height={280}>
										<AreaChart data={cumulativeData}>
											<defs>
												<linearGradient
													id="areaGradient"
													x1="0"
													y1="0"
													x2="0"
													y2="1"
												>
													<stop
														offset="5%"
														stopColor="#0d9488"
														stopOpacity={0.7}
													/>
													<stop
														offset="95%"
														stopColor="#0d9488"
														stopOpacity={0.1}
													/>
												</linearGradient>
											</defs>
											<CartesianGrid
												strokeDasharray="3 3"
												stroke="#ccfbf1"
												vertical={false}
											/>
											<XAxis
												dataKey="date"
												stroke="#0f766e"
												style={{ fontSize: "12px" }}
											/>
											<YAxis
												stroke="#0f766e"
												style={{ fontSize: "12px" }}
											/>
											<Tooltip
												content={<CustomTooltip />}
											/>
											<Area
												type="monotone"
												dataKey="cumulative"
												stroke="#0d9488"
												fill="url(#areaGradient)"
												strokeWidth={2}
											/>
										</AreaChart>
									</ResponsiveContainer>
								) : (
									<div className="flex items-center justify-center h-72 text-teal-600">
										No data available
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Line Chart */}
					<div className="card-lg">
						<div className="space-y-4">
							<h3 className="text-lg font-bold text-teal-900 flex items-center gap-2">
								<div className="h-8 w-8 rounded-lg bg-linear-to-br from-teal-300 to-teal-400 flex items-center justify-center">
									<FiActivity className="h-4 w-4 text-white" />
								</div>
								Detailed Trend Analysis
							</h3>

							<div className="grid grid-cols-3 gap-3 mb-6">
								<div className="rounded-xl bg-linear-to-br from-teal-50 to-teal-100/50 p-4 border border-teal-200/50">
									<p className="text-xs font-semibold text-teal-600 uppercase">
										Peak
									</p>
									<p className="text-2xl font-black text-teal-900 mt-2">
										{maxClicks}
									</p>
								</div>
								<div className="rounded-xl bg-linear-to-br from-teal-50 to-cyan-50 p-4 border border-teal-200/50">
									<p className="text-xs font-semibold text-teal-600 uppercase">
										Average
									</p>
									<p className="text-2xl font-black text-teal-700 mt-2">
										{avgClicks}
									</p>
								</div>
								<div className="rounded-xl bg-linear-to-br from-teal-100/30 to-teal-50 p-4 border border-teal-200/50">
									<p className="text-xs font-semibold text-teal-600 uppercase">
										Total
									</p>
									<p className="text-2xl font-black text-teal-800 mt-2">
										{chartData.reduce(
											(sum, d) => sum + d.clicks,
											0
										)}
									</p>
								</div>
							</div>

							{clicksLoading ? (
								<div className="flex items-center justify-center h-72">
									<div className="text-center">
										<div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600 mb-3" />
										<p className="text-teal-600 font-medium">
											Loading...
										</p>
									</div>
								</div>
							) : chartData.length > 0 ? (
								<ResponsiveContainer width="100%" height={300}>
									<ComposedChart data={chartData}>
										<defs>
											<linearGradient
												id="lineGradient"
												x1="0"
												y1="0"
												x2="0"
												y2="1"
											>
												<stop
													offset="5%"
													stopColor="#0d9488"
													stopOpacity={0.8}
												/>
												<stop
													offset="95%"
													stopColor="#0d9488"
													stopOpacity={0.1}
												/>
											</linearGradient>
										</defs>
										<CartesianGrid
											strokeDasharray="3 3"
											stroke="#ccfbf1"
											vertical={false}
										/>
										<XAxis
											dataKey="date"
											stroke="#0f766e"
											style={{ fontSize: "12px" }}
										/>
										<YAxis
											stroke="#0f766e"
											style={{ fontSize: "12px" }}
										/>
										<Tooltip
											content={<CustomTooltip />}
										/>
										<Bar
											dataKey="clicks"
											fill="#99f6e4"
											opacity={0.3}
											radius={[8, 8, 0, 0]}
										/>
										<Line
											type="monotone"
											dataKey="clicks"
											stroke="#0d9488"
											strokeWidth={3}
											dot={{
												fill: "#0d9488",
												r: 5,
											}}
											activeDot={{ r: 7 }}
										/>
									</ComposedChart>
								</ResponsiveContainer>
							) : (
								<div className="flex items-center justify-center h-72 text-teal-600">
									No data available
								</div>
							)}
						</div>
					</div>

					{/* Pie Chart & Referrers */}
					{overview?.top_referrers && overview.top_referrers.length > 0 && (
						<div className="grid gap-6 lg:grid-cols-2">
							{/* Pie Chart */}
							<div className="card-lg">
								<h3 className="text-lg font-bold text-teal-900 flex items-center gap-2 mb-6">
									<div className="h-8 w-8 rounded-lg bg-linear-to-br from-teal-300 to-teal-400 flex items-center justify-center">
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
												`${(name ?? 'Unknown').substring(0, 12)}: ${((percent ?? 0) * 100).toFixed(0)}%`
											}
											outerRadius={80}
											fill="#8884d8"
											dataKey="value"
										>
											{referrerData.map((entry, index) => (
												<Cell
													key={`cell-${index}`}
													fill={CHART_COLORS[index % CHART_COLORS.length]}
												/>
											))}
										</Pie>
										<Tooltip
											formatter={(value) => `${value} clicks`}
											contentStyle={{
												backgroundColor: "#0f766e",
												border: "1px solid #0d9488",
												borderRadius: "8px",
												color: "#fff",
											}}
										/>
									</PieChart>
								</ResponsiveContainer>
							</div>

							{/* Referrer List */}
							<div className="card-lg">
								<h3 className="text-lg font-bold text-teal-900 flex items-center gap-2 mb-6">
									<div className="h-8 w-8 rounded-lg bg-linear-to-br from-teal-200 to-teal-300 flex items-center justify-center">
										<FiUsers className="h-4 w-4 text-teal-700" />
									</div>
									Top Referrers
								</h3>

								<div className="space-y-4">
									{overview.top_referrers.map((referrer, idx) => {
										const percentage = Math.round(
											(referrer.total /
												Math.max(
													...overview.top_referrers.map(
														(r) => r.total
													)
												)) *
												100
										);
										return (
											<div key={idx} className="group">
												<div className="flex items-center justify-between mb-2">
													<div className="flex items-center gap-2 min-w-0">
														<div
														className="w-3 h-3 rounded-full shrink-0"
															style={{
																backgroundColor:
																	CHART_COLORS[
																		idx %
																			CHART_COLORS.length
																	],
															}}
														/>
														<p className="text-sm font-bold text-teal-800 truncate">
															{referrer.referrer ||
																"Direct"}
														</p>
													</div>
											<div className="text-right shrink-0">
														<p className="text-sm font-bold text-teal-900">
															{referrer.total}
														</p>
													</div>
												</div>
												<div className="h-2 bg-teal-100 rounded-full overflow-hidden">
													<div
														className="h-full rounded-full transition-all duration-500 shadow-lg"
														style={{
															width: `${percentage}%`,
															backgroundColor:
																CHART_COLORS[
																	idx %
																		CHART_COLORS.length
																],
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

					{/* Recent Clicks */}
					<div className="card-lg">
						<div>
							<h3 className="text-lg font-bold text-teal-900 flex items-center gap-2 mb-6">
								<div className="h-8 w-8 rounded-lg bg-linear-to-br from-teal-300 to-teal-400 flex items-center justify-center">
									<FiClock className="h-4 w-4 text-white" />
								</div>
								Recent Activity
							</h3>
							<p className="text-sm text-teal-600 mb-4">
								Last 10 clicks across all links
							</p>

							{recentLoading ? (
								<div className="flex items-center justify-center py-16">
									<div className="text-center">
										<div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600 mb-3" />
										<p className="text-teal-600 font-medium">
											Loading recent clicks...
										</p>
									</div>
								</div>
							) : recentClicks && recentClicks.length > 0 ? (
								<div className="space-y-3">
									{recentClicks.slice(0, 10).map((click) => (
										<div
											key={click.id}
											className="group/item rounded-xl p-4 bg-linear-to-r from-teal-50 via-teal-25 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 border border-teal-200/30 hover:border-teal-300/50 transition-all"
										>
											<div className="flex items-center justify-between gap-4">
												<div className="flex items-center gap-4 flex-1 min-w-0">
													<div className="h-10 w-10 rounded-lg bg-linear-to-br from-teal-300 to-teal-400 flex items-center justify-center shadow-lg shrink-0">
														<FiMousePointer className="h-5 w-5 text-white" />
													</div>
													<div className="min-w-0 flex-1">
														<p className="font-bold text-teal-900 truncate text-sm">
															{click.link.title}
														</p>
														<p className="text-xs text-teal-600 mt-1">
															{click.city}, {click.country}
														</p>
													</div>
												</div>

												<div className="flex gap-2 shrink-0">
													<div className="hidden sm:block">
														<div className="inline-block px-3 py-1 rounded-lg bg-teal-100 border border-teal-200">
															<p className="text-xs font-bold text-teal-700">
																{click.browser}
															</p>
														</div>
													</div>
													<div className="hidden sm:block">
														<div className="inline-block px-3 py-1 rounded-lg bg-teal-100 border border-teal-200">
															<p className="text-xs font-bold text-teal-700">
																{click.platform}
															</p>
														</div>
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="flex flex-col items-center justify-center py-12 text-teal-600">
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
