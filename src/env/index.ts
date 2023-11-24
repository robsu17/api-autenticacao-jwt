import { env } from "node:process";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  SECRET_KEY: z.string(),
});

const _env = envSchema.safeParse(env);

if (_env.success === false) {
  console.error("⚠️ A invalide environment variables!", _env.error.format());
  throw new Error("invalid environment variables.");
}

export const environment = _env.data;
