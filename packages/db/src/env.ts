import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error(
    "❌ Invalid environment variables:",
    z.prettifyError(_env.error),
  );
  throw new Error(
    `Invalid environment variables ${z.prettifyError(_env.error)}`,
  );
}

export const env = _env.data;
