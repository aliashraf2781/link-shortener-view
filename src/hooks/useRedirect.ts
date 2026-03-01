import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

type RedirectResponse = {
	message?: string;
	status?: string;
	data?: string;
};

async function fetchRedirect(slug: string) {
	const { data } = await api.get<RedirectResponse>(`/${slug}`, {
		headers: { "ngrok-skip-browser-warning": "true" },
	});

	if (data?.status !== "success" || !data?.data) {
		throw new Error(data?.message || "Invalid redirect link");
	}

	return data.data;
}

export function useRedirect(slug: string | undefined, delayMs = 1200) {
	const query = useQuery({
		queryKey: ["redirect", slug],
		queryFn: () => fetchRedirect(slug!),
		enabled: Boolean(slug),
		retry: 0,
	});

	useEffect(() => {
		if (!query.data) return;

		const timerId = setTimeout(() => {
			window.location.href = query.data!;
		}, delayMs);

		return () => clearTimeout(timerId);
	}, [query.data, delayMs]);

	return query;
}
