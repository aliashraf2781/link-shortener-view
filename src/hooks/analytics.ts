import {
	useQuery,
	type UseQueryOptions,
} from "@tanstack/react-query";
import {
	getAnalyticsOverview,
	getClicksOverTime,
	getLinkAnalytics,
	getRecentClicks,
	type AnalyticsOverview,
	type ClicksOverTime,
	type LinkAnalytics,
	type RecentClick,
} from "@/services/analytics";

const ANALYTICS_QUERY_KEYS = {
	overview: () => ["analytics", "overview"],
	clicksOverTime: (params?: {
		from?: string;
		to?: string;
		period?: "year" | "month" | "week";
	}) => ["analytics", "clicksOverTime", params],
	linkAnalytics: (linkId: number) => ["analytics", "link", linkId],
	recentClicks: () => ["analytics", "recentClicks"],
};

export function useAnalyticsOverviewQuery(
	options?: UseQueryOptions<AnalyticsOverview, Error>
) {
	return useQuery({
		queryKey: ANALYTICS_QUERY_KEYS.overview(),
		queryFn: getAnalyticsOverview,
		staleTime: 1000 * 60 * 5,
		...options,
	});
}

export function useClicksOverTimeQuery(
	params?: {
		from?: string;
		to?: string;
		period?: "year" | "month" | "week";
	},
	options?: UseQueryOptions<ClicksOverTime, Error>
) {
	return useQuery({
		queryKey: ANALYTICS_QUERY_KEYS.clicksOverTime(params),
		queryFn: () => getClicksOverTime(params),
		staleTime: 1000 * 60 * 5,
		...options,
	});
}

export function useLinkAnalyticsQuery(
	linkId: number,
	options?: UseQueryOptions<LinkAnalytics, Error>
) {
	return useQuery({
		queryKey: ANALYTICS_QUERY_KEYS.linkAnalytics(linkId),
		queryFn: () => getLinkAnalytics(linkId),
		staleTime: 1000 * 60 * 5,
		...options,
	});
}

export function useRecentClicksQuery(
	options?: UseQueryOptions<RecentClick[], Error>
) {
	return useQuery({
		queryKey: ANALYTICS_QUERY_KEYS.recentClicks(),
		queryFn: getRecentClicks,
		staleTime: 1000 * 60 * 2,
		...options,
	});
}
