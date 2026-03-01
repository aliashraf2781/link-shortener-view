"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Button } from "@/components/ui";
import { createLinkSchema, type CreateLinkInput } from "@/schemas/link.schema";
import { useCreateLinkMutation } from "@/hooks";
import { showToast, getBackendMessage } from "@/lib";

type CreateLinkModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

export function CreateLinkModal({ isOpen, onClose }: CreateLinkModalProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<CreateLinkInput>({
		resolver: zodResolver(createLinkSchema),
	});

	const { mutate: createLink, isPending } = useCreateLinkMutation({
		onSuccess: () => {
			showToast({ state: "success", title: "Link created successfully" });
			reset();
			onClose();
		},
		onError: (error) => {
			showToast({ state: "error", title: getBackendMessage(error) });
		},
	});

	const onSubmit = (data: CreateLinkInput) => {
		createLink(data);
	};

	const handleClose = () => {
		reset();
		onClose();
	};

	return (
		<Modal isOpen={isOpen} onClose={handleClose} title="Create Short Link">
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-8">
				<div className="space-y-2">
					<label className="text-sm font-semibold text-gray-900">
						Original URL <span className="text-red-500">*</span>
					</label>
					<input
						{...register("original_url")}
						type="url"
						placeholder="https://example.com"
						className="w-full rounded-xl border border-gray-200 bg-linear-to-br from-blue-50/50 to-cyan-50/30 px-4 py-3 text-sm focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30 transition-all duration-200"
					/>
					{errors.original_url?.message && (
						<p className="text-xs text-red-500 font-medium">{errors.original_url.message}</p>
					)}
				</div>

				<div className="space-y-2">
					<label className="text-sm font-semibold text-gray-900">Custom Alias</label>
					<input
						{...register("custom_alias")}
						type="text"
						placeholder="my-custom-link (optional)"
						className="w-full rounded-xl border border-gray-200 bg-linear-to-br from-green-50/50 to-emerald-50/30 px-4 py-3 text-sm focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30 transition-all duration-200"
					/>
					<p className="text-xs text-gray-500">
						Letters, numbers, hyphens, and underscores only
					</p>
					{errors.custom_alias?.message && (
						<p className="text-xs text-red-500 font-medium">{errors.custom_alias.message}</p>
					)}
				</div>

				<div className="space-y-2">
					<label className="text-sm font-semibold text-gray-900">Title</label>
					<input
						{...register("title")}
						type="text"
						placeholder="My Link (optional)"
						className="w-full rounded-xl border border-gray-200 bg-linear-to-br from-purple-50/50 to-pink-50/30 px-4 py-3 text-sm focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30 transition-all duration-200"
					/>
					{errors.title?.message && (
						<p className="text-xs text-red-500 font-medium">{errors.title.message}</p>
					)}
				</div>

				<div className="flex gap-3 pt-4">
					<Button
						type="button"
						onClick={handleClose}
						variant="outline"
						className="flex-1"
						disabled={isPending}
					>
						Cancel
					</Button>
					<Button
						type="submit"
						variant="primary"
						className="flex-1 shadow-lg hover:shadow-xl"
						isLoading={isPending}
					>
						Create Link
					</Button>
				</div>
			</form>
		</Modal>
	);
}
