import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.issues);
  throw new Error("Invalid environment variables");
}

export const env = _env.data;
