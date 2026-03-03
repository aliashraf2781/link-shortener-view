export default function Loading() {
	return (
		<div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(13,122,138,0.2),transparent_55%),radial-gradient(circle_at_bottom,rgba(77,182,199,0.2),transparent_45%)]">
			<div className="pointer-events-none absolute -left-16 top-16 h-64 w-64 rounded-full bg-teal/10 blur-3xl" />
			<div className="pointer-events-none absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-teal-light/20 blur-3xl" />

			<div className="relative mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-6 text-center">
				<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-800/20 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal shadow-sm">
					Redirect service
				</div>

				<h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
					Checking your link
				</h1>
				<p className="mt-3 max-w-lg text-sm text-gray-500 sm:text-base">
					We are resolving the destination securely.
				</p>

				<div className="mt-8 w-full rounded-3xl border border-teal-800/20 bg-white/80 p-6 shadow-[0_30px_80px_-40px_rgba(13,122,138,0.6)] backdrop-blur">
					<div className="flex flex-col gap-3 text-left">
						<span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
							Destination
						</span>
						<div className="rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-400">
							Resolving...
						</div>
					</div>

					<div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
						<span className="inline-flex h-2.5 w-2.5 animate-pulse rounded-full bg-teal" />
						Redirecting soon
					</div>
				</div>
			</div>
		</div>
	);
}
