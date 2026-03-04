"use client";

import { useState } from "react";
import { CreateLinkModal, QRCodeModal } from "@/components/core";
import { Table, Button, Modal } from "@/components/ui";
import type { Column } from "@/components/ui/Table";
import {
	useLinksQuery,
	useDeleteLinkMutation,
	useToggleLinkMutation,
} from "@/hooks";
import { showToast, getBackendMessage } from "@/lib";
import type { Link } from "@/services/link";
import {
	FiPlus,
	FiGrid,
	FiTrash2,
	FiCopy,
	FiExternalLink,
	FiToggleRight,
	FiLink,
	FiMousePointer,
	FiBarChart2,
	FiCheckCircle,
	FiCircle,
	FiAlertCircle,
} from "react-icons/fi";

export default function DashboardPage() {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [qrModalData, setQrModalData] = useState<{
		url: string;
		title?: string;
	} | null>(null);
	const [toggleConfirmLinkId, setToggleConfirmLinkId] = useState<number | null>(null);

	const { data: links = [], isLoading, isError, error } = useLinksQuery();

	const { mutate: deleteLink, isPending: isDeleting } = useDeleteLinkMutation({
		onSuccess: () => {
			showToast({ state: "success", title: "Link deleted successfully" });
		},
		onError: (error) => {
			showToast({ state: "error", title: getBackendMessage(error) });
		},
	});

	const { mutate: toggleLink } = useToggleLinkMutation({
		onSuccess: () => {
			showToast({ state: "success", title: "Link status updated" });
		},
		onError: (error) => {
			showToast({ state: "error", title: getBackendMessage(error) });
		},
	});

	const handleCopyLink = (shortCode: string, customAlias?: string | null) => {
		const linkToCopy = customAlias || shortCode;
		const fullUrl = `${window.location.origin}/go/${linkToCopy}`;
		navigator.clipboard.writeText(fullUrl);
		showToast({ state: "success", title: "Link copied to clipboard" });
	};

	const handleShowQR = (link: Link) => {
		const shortLink = link.custom_alias || link.short_code;
		const fullUrl = `${window.location.origin}/go/${shortLink}`;
		setQrModalData({
			url: fullUrl,
			title: link.title || undefined,
		});
	};

	const handleDelete = (id: number) => {
		if (confirm("Are you sure you want to delete this link?")) {
			deleteLink(id);
		}
	};

	const handleToggleClick = (link: Link) => {
		if (link.is_active === "active") {
			setToggleConfirmLinkId(link.id);
			return;
		}

		toggleLink(link.id);
	};

	const handleConfirmToggle = () => {
		if (toggleConfirmLinkId !== null) {
			toggleLink(toggleConfirmLinkId);
			setToggleConfirmLinkId(null);
		}
	};

	const columns: Column<Link>[] = [
		{
			key: "title",
			header: "Title",
			render: (link) => (
				<div className="max-w-xs">
					<p className="font-medium text-gray-900 truncate">
						{link.title || "Untitled"}
					</p>
					<a
						href={link.original_link}
						target="_blank"
						rel="noopener noreferrer"
						className="text-xs text-gray-500 hover:text-teal-600 truncate flex items-center gap-1 mt-0.5"
					>
						<span className="truncate">{link.original_link}</span>
						<FiExternalLink className="h-3 w-3 shrink-0" />
					</a>
				</div>
			),
		},
		{
			key: "short_code",
			header: "Generated Link",
			render: (link) => {
				const shortLink = link.custom_alias || link.short_code;
				const fullUrl = `${window.location.origin}/go/${shortLink}`;
				return (
					<div className="flex items-center gap-2">
						<a
							href={fullUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="rounded bg-gray-100 px-2 py-1 text-xs font-mono text-teal-700 hover:bg-gray-200 transition max-w-xs truncate flex items-center gap-1"
							title={fullUrl}
						>
							<span className="truncate">/{shortLink}</span>
							<FiExternalLink className="h-3 w-3 shrink-0" />
						</a>
						<button
							onClick={() => handleCopyLink(link.short_code, link.custom_alias)}
							className="text-gray-400 hover:text-teal-600 transition"
							title="Copy link"
						>
							<FiCopy className="h-4 w-4" />
						</button>
					</div>
				);
			},
		},
		{
			key: "clicks_count",
			header: "Clicks",
			render: (link) => (
				<span className="font-semibold text-gray-900">{link.clicks_count}</span>
			),
			className: "text-center",
			headerClassName: "text-center",
		},
		{
			key: "is_active",
			header: "Status",
			render: (link) => (
				<div className="flex items-center justify-center">
					<span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
						link.is_active == "active"
							? "bg-green-100/80 text-green-700" 
							: "bg-gray-100/80 text-gray-600"
					}`}>
						{link.is_active == "active" ? (
							<>
								<FiCheckCircle className="h-4 w-4" />
								Active
							</>
						) : (
							<>
								<FiCircle className="h-4 w-4" />
								Inactive
							</>
						)}
					</span>
				</div>
			),
			className: "text-center",
			headerClassName: "text-center",
		},
		{
			key: "actions",
			header: "Actions",
			render: (link) => (
				<div className="flex items-center w-full gap-2">
					<button
						onClick={() => handleShowQR(link)}
						className="rounded-lg p-2 text-gray-600 hover:bg-teal-50 hover:text-teal-600 transition"
						title="Show QR Code"
					>
						<FiGrid className="h-4 w-4" />
					</button>
					<button
						onClick={() => handleToggleClick(link)}
						className="rounded-lg p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
						title="Toggle status"
					>
						<FiToggleRight className="h-4 w-4" />
					</button>
					<button
						onClick={() => handleDelete(link.id)}
						disabled={isDeleting}
						className="rounded-lg p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
						title="Delete link"
					>
						<FiTrash2 className="h-4 w-4" />
					</button>
				</div>
			),
			className: "text-start",
			headerClassName: "text-start",
		},
	];

	return (
		<>
			<div className="space-y-8">
				{/* Header */}
				<div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-indigo-600 via-violet-600 to-purple-700 p-8 md:p-10 shadow-2xl">
					<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTMwVjBoLTEydjRoMTJ6TTI0IDI0aDEydi0xMkgyNHYxMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
					<div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
					<div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-indigo-300/20 blur-3xl" />
					<div className="relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
						<div>
							<div className="flex items-center gap-3 mb-2">
								<div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
									<FiLink className="h-5 w-5 text-white" />
								</div>
								<span className="text-indigo-200 text-sm font-semibold uppercase tracking-wider">Dashboard</span>
							</div>
							<h2 className="text-4xl md:text-5xl font-black text-white">
								Your Links
							</h2>
							<p className="mt-2 text-indigo-200 font-medium text-lg">
								Manage and track your shortened links
							</p>
						</div>
						<Button
							onClick={() => setIsCreateModalOpen(true)}
							icon={FiPlus}
							iconPosition="left"
							className="shadow-lg hover:shadow-xl transition-all bg-white text-indigo-700 hover:bg-indigo-50 font-bold"
						>
							Create Link
						</Button>
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid gap-5 md:grid-cols-3">
					{[
						{
							label: "Total Links",
							value: links.length,
							Icon: FiLink,
							gradient: "from-indigo-500 to-indigo-600",
							bgLight: "bg-indigo-50",
							iconColor: "text-indigo-600",
							ring: "ring-indigo-100",
						},
						{
							label: "Total Clicks",
							value: links.reduce((sum, link) => sum + link.clicks_count, 0),
							Icon: FiMousePointer,
							gradient: "from-violet-500 to-purple-600",
							bgLight: "bg-violet-50",
							iconColor: "text-violet-600",
							ring: "ring-violet-100",
						},
						{
							label: "Avg. Clicks/Link",
							value: links.length > 0
								? Math.round(
										links.reduce((sum, link) => sum + link.clicks_count, 0) /
											links.length
								  )
								: 0,
							Icon: FiBarChart2,
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
							<div className="relative space-y-4">
								<div className="flex items-center justify-between">
									<div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl ${stat.bgLight} group-hover:scale-110 transition-transform`}>
										<stat.Icon className={`h-6 w-6 ${stat.iconColor}`} />
									</div>
								</div>
								<div>
									<p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
										{stat.label}
									</p>
									<p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Table */}
				{isLoading ? (
					<div className="flex items-center justify-center py-16">
						<div className="text-center space-y-4">
							<div className="relative inline-flex">
								<div className="h-14 w-14 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
							</div>
							<p className="text-gray-500 font-medium">Loading your links...</p>
						</div>
					</div>
				) : isError ? (
					<div className="rounded-2xl bg-linear-to-br from-red-50 to-rose-50 border border-red-200/60 p-8 text-center shadow-sm">
						<p className="text-red-700 font-semibold">
							{getBackendMessage(error, "Failed to load links")}
						</p>
					</div>
				) : (
					<Table
						columns={columns}
						data={links}
						keyExtractor={(link) => link.id}
						emptyMessage="No links yet. Create your first link to get started!"
						striped
						hoverable
					/>
				)}
			</div>

			{/* Modals */}
			<CreateLinkModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
			/>

			{qrModalData && (
				<QRCodeModal
					isOpen={!!qrModalData}
					onClose={() => setQrModalData(null)}
					url={qrModalData.url}
					title={qrModalData.title}
				/>
			)}

			<Modal
				isOpen={toggleConfirmLinkId !== null}
				onClose={() => setToggleConfirmLinkId(null)}
				title="Toggle Link Status"
				size="sm"
				footer={
					<div className="flex gap-3 justify-end">
						<Button
							onClick={() => setToggleConfirmLinkId(null)}
							className="bg-gray-200 hover:bg-gray-300 text-gray-900"
						>
							Cancel
						</Button>
						<Button
							onClick={handleConfirmToggle}
							className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/25"
						>
							Proceed
						</Button>
					</div>
				}
			>
				<div className="space-y-4">
					<div className="flex gap-3">
						<div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
							<FiAlertCircle className="h-5 w-5 text-amber-600" />
						</div>
						<div>
							<p className="text-gray-900 font-bold">
								Toggle Limit Restriction
							</p>
							<p className="text-sm text-gray-600 mt-1">
								You have one toggle available every 2 days. This action will count towards that limit.
							</p>
						</div>
					</div>
					<p className="text-sm text-gray-700 bg-amber-50/50 rounded-xl p-4 ring-1 ring-amber-100">
						{"Are you sure you want to proceed with toggling this link's status?"}
					</p>
				</div>
			</Modal>
		</>
	);
}
