import { z } from "zod";

export const createLinkSchema = z.object({
	original_url: z
		.string()
		.min(1, "URL is required")
		.url("Please enter a valid URL"),
	custom_alias: z
		.string()
		.optional()
		.refine(
			(val) => !val || /^[a-zA-Z0-9_-]+$/.test(val),
			"Alias can only contain letters, numbers, hyphens, and underscores"
		),
	title: z.string().optional(),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
