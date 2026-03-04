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
		<div className="relative min-h-screen overflow-hidden bg-linear-to-b from-teal-50/60 via-white to-cyan-50/30">
			<div className="pointer-events-none absolute -left-16 top-16 h-64 w-64 rounded-full bg-teal-400/15 blur-3xl" />
			<div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-cyan-300/15 blur-3xl" />

			<div className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-6 text-center">
				<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200/40 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal-600 shadow-sm">
					Redirect service
				</div>

				<h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
					{isError ? "Link unavailable" : "Taking you there"}
				</h1>
				<p className="mt-3 max-w-lg text-sm text-gray-500 sm:text-base">
					{description}
				</p>

				<div className="mt-8 w-full rounded-3xl border border-teal-200/40 bg-white/80 p-6 shadow-2xl shadow-teal-600/15 backdrop-blur">
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
							<span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-teal-500" />
							{isError ? "Try a new link." : "Redirecting now"}
						</div>

						{destination && !isError ? (
							<a
								href={destination}
								className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-teal-600 to-teal-500 px-5 py-2 text-sm font-semibold text-white transition hover:from-teal-700 hover:to-teal-600 shadow-md shadow-teal-600/20"
							>
								Open now
							</a>
						) : (
							<Link
								href="/"
								className="inline-flex items-center justify-center rounded-full border border-teal-300/50 px-5 py-2 text-sm font-semibold text-teal-600 transition hover:bg-teal-50"
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
