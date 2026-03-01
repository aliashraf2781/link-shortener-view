import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseMutationOptions,
} from "@tanstack/react-query";
import {
	createLink,
	deleteLink,
	getLinks,
	toggleLink,
	type Link,
} from "@/services/link";
import type { CreateLinkInput } from "@/schemas/link.schema";

const LINKS_QUERY_KEY = ["links"];

export function useLinksQuery() {
	return useQuery({
		queryKey: LINKS_QUERY_KEY,
		queryFn: getLinks,
	});
}

export function useCreateLinkMutation(
	options?: UseMutationOptions<Link, Error, CreateLinkInput>
) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createLink,
		onSuccess: (...args) => {
			queryClient.invalidateQueries({ queryKey: LINKS_QUERY_KEY });
			options?.onSuccess?.(...args);
		},
		onError: options?.onError,
	});
}

export function useDeleteLinkMutation(
	options?: UseMutationOptions<void, Error, number>
) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteLink,
		onSuccess: (...args) => {
			queryClient.invalidateQueries({ queryKey: LINKS_QUERY_KEY });
			options?.onSuccess?.(...args);
		},
		onError: options?.onError,
	});
}

export function useToggleLinkMutation(
	options?: UseMutationOptions<Link, Error, number>
) {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: toggleLink,
		onSuccess: (...args) => {
			queryClient.invalidateQueries({ queryKey: LINKS_QUERY_KEY });
			options?.onSuccess?.(...args);
		},
		onError: options?.onError,
	});
}
