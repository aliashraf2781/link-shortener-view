import { api } from "@/lib/axios";
import type { CreateLinkInput } from "@/schemas/link.schema";

export type Visit = {
	id: number;
	user_agent: string;
	city: string;
	country: string;
	region: string;
	device_type: string;
	browser: string;
	platform: string;
	clicked_at: string;
};

export type Link = {
	id: number;
	original_link: string;
	short_code: string;
	title: string | null;
	custom_alias: string | null;
	clicks_count: number;
	is_active: "active" | "inactive";
	visits: Visit[];
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

export async function createLink(payload: CreateLinkInput) {
	const response = await api.post<ApiResponse<Link>>("/generate", payload);
	return assertSuccess(response.data);
}

export async function getLinks() {
	const response = await api.get<ApiResponse<Link[]>>("/links");
	return assertSuccess(response.data);
}

export async function deleteLink(id: number): Promise<void> {
	const response = await api.delete<ApiResponse>(`/delete-link/${id}`);
	assertSuccess(response.data);
}

export async function toggleLink(id: number) {
	const response = await api.post<ApiResponse<Link>>(`/toggle-link/${id}`);
	return assertSuccess(response.data);
}
