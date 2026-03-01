import { api } from "@/lib/axios";

export type AnalyticsOverview = {
	total_links: number;
	active_link: number;
	inactive_link: number;
	total_clicks: number;
	best_performing_link: {
		id: number;
		title: string;
		short_code: string;
		original_url: string;
		clicks: number;
	};
	top_five_links: Array<{
		id: number;
		title: string;
		short_code: string;
		original_url: string;
		clicks: number;
	}>;
	peak_hours: Array<{
		hour: number;
		total: number;
	}>;
	top_referrers: Array<{
		referrer: string;
		total: number;
	}>;
};

export type ClicksOverTime = {
	period: "year" | "monthly" | "weekly";
	clicks_over_time: Array<{
		date: string;
		clicks: number;
	}>;
};

export type LinkAnalytics = {
	link: {
		id: number;
		title: string;
		short_code: string;
		original_url: string;
		is_active: boolean;
		total_clicks: number;
	};
	analytics: {
		top_countries: Array<{
			country: string;
			total: number;
		}>;
		top_cities: Array<{
			city: string;
			total: number;
		}>;
		browsers: Array<{
			browser: string;
			total: number;
		}>;
		platforms: Array<{
			platform: string;
			total: number;
		}>;
		peak_hours: Array<{
			hour: number;
			total: number;
		}>;
		top_referrers: Array<{
			referrer: string;
			total: number;
		}>;
		clicks_over_time: Array<{
			date: string;
			total: number;
		}>;
	};
};

export type RecentClick = {
	id: number;
	link_id: number;
	country: string;
	city: string;
	device_type: string;
	browser: string;
	platform: string;
	created_at: string;
	link: {
		id: number;
		title: string;
		short_code: string;
	};
};

type ApiResponse<T = unknown> = {
	message: string;
	status: "success" | "error";
	data?: T;
	errors?: Record<string, string[]>;
};

function assertSuccess<T>(response: ApiResponse<T>): T {
	if (response.status !== "success" || !response.data) {
		const errorMessage =
			response.message || response.errors
				? Object.values(response.errors || {})
						.flat()
						.join(", ")
				: "Request failed";
		throw new Error(errorMessage);
	}
	return response.data;
}

export async function getAnalyticsOverview() {
	const response = await api.get<ApiResponse<AnalyticsOverview>>("/overview");
	return assertSuccess(response.data);
}

export async function getClicksOverTime(params?: {
	from?: string;
	to?: string;
	period?: "year" | "monthly" | "weekly";
}) {
	const response = await api.get<ApiResponse<ClicksOverTime>>(
		"/clicks-over-time",
		{ params }
	);
	return assertSuccess(response.data);
}

export async function getLinkAnalytics(linkId: number) {
	const response = await api.get<ApiResponse<LinkAnalytics>>(`/links/${linkId}`);
	return assertSuccess(response.data);
}

export async function getRecentClicks() {
	const response = await api.get<ApiResponse<RecentClick[]>>("/recent-clicks");
	return assertSuccess(response.data);
}
