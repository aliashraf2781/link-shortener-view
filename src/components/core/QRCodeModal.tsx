"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Modal } from "@/components/ui";
import { showToast } from "@/lib";

type QRCodeModalProps = {
	isOpen: boolean;
	onClose: () => void;
	url: string;
	title?: string;
};

export function QRCodeModal({ isOpen, onClose, url, title }: QRCodeModalProps) {
	const qrRef = useRef<HTMLDivElement>(null);

	const handleDownload = () => {
		const canvas = qrRef.current?.querySelector("canvas");
		if (!canvas) return;

		canvas.toBlob((blob) => {
			if (!blob) return;
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `qr-code-${title || "link"}.png`;
			link.click();
			URL.revokeObjectURL(url);
			showToast({ state: "success", title: "QR code downloaded successfully" });
		});
	};

	const handleCopy = async () => {
		const canvas = qrRef.current?.querySelector("canvas");
		if (!canvas) return;

		try {
			canvas.toBlob(async (blob) => {
				if (!blob) return;
				await navigator.clipboard.write([
					new ClipboardItem({ "image/png": blob }),
				]);
				showToast({ state: "success", title: "QR code copied to clipboard" });
			});
		} catch {
			showToast({ state: "error", title: "Failed to copy QR code" });
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="QR Code">
			<div className="flex flex-col items-center gap-6 p-8">
				<div
					ref={qrRef}
					className="relative rounded-3xl bg-linear-to-br from-white to-blue-50/40 p-6 shadow-lg hover:shadow-xl transition-all duration-300"
				>
					<div className="absolute inset-0 rounded-3xl bg-linear-to-br from-teal-50/40 to-cyan-50/40 pointer-events-none" />
					<div className="relative bg-white rounded-2xl p-4">
						<QRCodeCanvas value={url} size={256} level="H" />
					</div>
				</div>

				{title && (
					<div className="text-center space-y-2 w-full">
						<p className="text-sm font-semibold text-gray-900">{title}</p>
						<p className="text-xs text-gray-500 break-all bg-gray-50/80 rounded-lg px-3 py-2">
							{url}
						</p>
					</div>
				)}

				<div className="flex w-full gap-3 pt-2">
					<button
						onClick={handleCopy}
						className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold bg-linear-to-r from-teal-50 to-cyan-50 text-teal-600 hover:from-teal-100 hover:to-cyan-100 transition-all duration-200 hover:shadow-md"
					>
						Copy Image
					</button>
					<button
						onClick={handleDownload}
						className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold bg-linear-to-r from-teal-600 to-teal-500 text-white hover:shadow-lg transition-all duration-200 hover:shadow-teal-500/25"
					>
						Download
					</button>
				</div>
			</div>
		</Modal>
	);
}
