import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
	PORT: z.coerce.number().min(1000).max(25565),
	BASE_URL: z.string().url().endsWith("/"),
});

export const env = envSchema.parse(process.env);
