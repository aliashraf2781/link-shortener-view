"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getBackendMessage } from "@/lib";
import { useRedirect } from "@/hooks";

export default function SlugRedirectPage() {
	const params = useParams<{ slug: string | string[] }>();
	const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

	const { data: destination, isLoading, isError, error } = useRedirect(slug);
	const description = isError
		? getBackendMessage(error, "We could not resolve this link.")
		: "Preparing your destination.";

	return (
		<div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(13,122,138,0.2),transparent_55%),radial-gradient(circle_at_bottom,rgba(77,182,199,0.2),transparent_45%)]">
			<div className="pointer-events-none absolute -left-16 top-16 h-64 w-64 rounded-full bg-teal/10 blur-3xl" />
			<div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-teal-light/20 blur-3xl" />

			<div className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-6 text-center">
				<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-800/20 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal shadow-sm">
					Redirect service
				</div>

				<h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
					{isError ? "Link unavailable" : "Taking you there"}
				</h1>
				<p className="mt-3 max-w-lg text-sm text-gray-500 sm:text-base">
					{description}
				</p>

				<div className="mt-8 w-full rounded-3xl border border-teal-800/20 bg-white/80 p-6 shadow-[0_30px_80px_-40px_rgba(13,122,138,0.6)] backdrop-blur">
					<div className="flex flex-col gap-3 text-left">
						<span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
							Destination
						</span>
						<div className="rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-700">
							{isLoading ? "Resolving..." : destination || "-"}
						</div>
					</div>

					<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex items-center gap-2 text-sm text-gray-500">
							<span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-teal" />
							{isError ? "Try a new link." : "Redirecting now"}
						</div>

						{destination && !isError ? (
							<a
								href={destination}
								className="inline-flex items-center justify-center rounded-full bg-teal px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal-dark"
							>
								Open now
							</a>
						) : (
							<Link
								href="/"
								className="inline-flex items-center justify-center rounded-full border border-teal-800/30 px-5 py-2 text-sm font-semibold text-teal transition hover:bg-teal/10"
							>
								Go home
							</Link>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
