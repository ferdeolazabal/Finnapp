import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.string().min(1),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  MARKET_DATA_MAX_AGE_SECONDS: z.coerce.number().int().positive().default(300),
  OPENAI_API_KEY: z.string().min(1).optional(),
  IOL_BASE_URL: z.string().url().refine((url) => url.toLowerCase().includes('sandbox'), 'IOL_BASE_URL must target sandbox'),
  IOL_USERNAME: z.string().optional(),
  IOL_PASSWORD: z.string().optional(),
});
export type AppConfig = z.infer<typeof envSchema>;
export const loadConfig = (source: NodeJS.ProcessEnv = process.env): AppConfig => envSchema.parse(source);

