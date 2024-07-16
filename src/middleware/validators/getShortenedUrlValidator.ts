import { z } from "zod";

export const getShortenedUrlValidator = z.object({
	params: z.object({
		id: z.string({
			required_error: "Shortened URL is required",
		}),
	}),
});
