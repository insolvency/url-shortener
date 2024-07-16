import "dotenv/config";
import { z } from "zod";

const envSchema = z
	.object({
		PORT: z.coerce.number().min(1000).max(25565),
		BASE_URL: z.string().url().endsWith("/"),
		SHORTEN_LENGTH: z.coerce.number().min(5).max(32),

		DATASOURCE_PROVIDER: z.enum(["memory", "sqlite", "json"]),
		DATASOURCE_PATH: z.string().optional(),
	})
	.superRefine(
		({ DATASOURCE_PROVIDER, DATASOURCE_PATH }, refinementContext) => {
			if (
				DATASOURCE_PROVIDER in ["sqlite", "json"] &&
				DATASOURCE_PATH === undefined
			) {
				return refinementContext.addIssue({
					code: z.ZodIssueCode.custom,
					message:
						"DATASOURCE_PATH is required when DATABASE_PROVIDER is not 'memory'",
					path: ["DATASOURCE_PATH"],
				});
			}
		},
	);

export const env = envSchema.parse(process.env);
