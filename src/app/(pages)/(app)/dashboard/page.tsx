"use client";

import { useState } from "react";
import { CreateLinkModal, QRCodeModal } from "@/components/core";
import { Table, Button } from "@/components/ui";
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
} from "react-icons/fi";

export default function DashboardPage() {
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [qrModalData, setQrModalData] = useState<{
		url: string;
		title?: string;
	} | null>(null);

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
		const fullUrl = `${window.location.origin}/${linkToCopy}`;
		navigator.clipboard.writeText(fullUrl);
		showToast({ state: "success", title: "Link copied to clipboard" });
	};

	const handleShowQR = (link: Link) => {
		const shortLink = link.custom_alias || link.short_code;
		const fullUrl = `${window.location.origin}/${shortLink}`;
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
						className="text-xs text-gray-500 hover:text-teal truncate flex items-center gap-1 mt-0.5"
					>
						<span className="truncate">{link.original_link}</span>
						<FiExternalLink className="h-3 w-3 shrink-0" />
					</a>
				</div>
			),
		},
		{
			key: "short_code",
			header: "Short Link",
			render: (link) => {
				const shortLink = link.custom_alias || link.short_code;
				return (
					<div className="flex items-center gap-2">
						<code className="rounded bg-gray-100 px-2 py-1 text-xs font-mono text-teal-dark">
							/{shortLink}
						</code>
						<button
							onClick={() => handleCopyLink(link.short_code, link.custom_alias)}
							className="text-gray-400 hover:text-teal transition"
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
						className="rounded-lg p-2 text-gray-600 hover:bg-teal/10 hover:text-teal transition"
						title="Show QR Code"
					>
						<FiGrid className="h-4 w-4" />
					</button>
					<button
						onClick={() => toggleLink(link.id)}
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
				<div className="flex items-end justify-between">
					<div>
						<h2 className="text-4xl font-bold bg-linear-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
							Your Links
						</h2>
						<p className="mt-2 text-gray-500 font-medium">
							Manage and track your shortened links
						</p>
					</div>
					<Button
						onClick={() => setIsCreateModalOpen(true)}
						icon={FiPlus}
						iconPosition="left"
						className="shadow-lg hover:shadow-xl transition-all"
					>
						Create Link
					</Button>
				</div>

				{/* Stats Cards */}
				<div className="grid gap-6 md:grid-cols-3">
					{[
						{
							label: "Total Links",
							value: links.length,
							Icon: FiLink,
							gradient: "from-blue-50 to-cyan-50",
							borderColor: "from-blue-200 to-cyan-200",
						},
					{
						label: "Total Clicks",
						value: links.reduce((sum, link) => sum + link.clicks_count, 0),
						Icon: FiMousePointer,
						gradient: "from-purple-50 to-pink-50",
						borderColor: "from-purple-200 to-pink-200",
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
						gradient: "from-green-50 to-teal-50",
						borderColor: "from-green-200 to-teal-200",
					},
				].map((stat, idx) => (
					<div
						key={idx}
						className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${stat.gradient} p-6 shadow-sm hover:shadow-lg transition-all duration-300 backdrop-blur-sm`}
					>
						<div className={`absolute -right-8 -top-8 h-24 w-24 bg-linear-to-br ${stat.borderColor} opacity-10 rounded-full blur-2xl`} />
						<div className={`absolute -left-8 -bottom-8 h-32 w-32 bg-linear-to-br ${stat.borderColor} opacity-5 rounded-full blur-3xl`} />
						
						<div className="relative space-y-3">
							<div className="flex items-center justify-between">
								<p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
									{stat.label}
								</p>
								<stat.Icon className="h-8 w-8 text-gray-400" />
							</div>
							<p className="text-4xl font-bold text-gray-900">{stat.value}</p>
							<div className={`h-1 w-16 bg-linear-to-r ${stat.borderColor} rounded-full`} />
						</div>
					</div>
				))}
			</div>

				{/* Table */}
				{isLoading ? (
					<div className="flex items-center justify-center py-12">
						<div className="text-center">
							<div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-teal/20 border-t-teal mb-4" />
							<p className="text-gray-600 font-medium">Loading your links...</p>
						</div>
					</div>
				) : isError ? (
					<div className="rounded-2xl bg-linear-to-br from-red-50/80 to-orange-50/80 p-8 text-center backdrop-blur-sm border border-red-100/50">
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
		</>
	);
}
