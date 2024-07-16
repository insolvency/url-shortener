import { z } from "zod";

export const shortenUrlValidator = z.object({
	body: z.object({
		url: z
			.string({
				required_error: "URL to shorten is required",
			})
			.url("Provided URL is not a URL"),
	}),
});
