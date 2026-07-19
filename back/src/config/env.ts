import 'dotenv/config';
import { z } from 'zod';

const optionalString = z.preprocess(
  (value) => value === '' ? undefined : value,
  z.string().min(1).optional(),
);

const optionalUrl = z.preprocess(
  (value) => value === '' ? undefined : value,
  z.string().url().optional(),
);

const booleanString = z.enum(['true', 'false']).transform((value) => value === 'true');

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(8089),
  DATABASE_URL: z.string().min(1),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  MARKET_DATA_MAX_AGE_SECONDS: z.coerce.number().int().positive().default(300),
  OPENAI_API_KEY: optionalString,
  IOL_ENABLED: booleanString.default(false),
  IOL_ENVIRONMENT: z.literal('sandbox').default('sandbox'),
  IOL_API_VERSION: z.literal('v2').default('v2'),
  IOL_BASE_URL: optionalUrl,
  IOL_USERNAME: optionalString,
  IOL_PASSWORD: optionalString,
}).superRefine((config, context) => {
  if (!config.IOL_ENABLED) return;

  for (const field of ['IOL_BASE_URL', 'IOL_USERNAME', 'IOL_PASSWORD'] as const) {
    if (!config[field]) {
      context.addIssue({ code: 'custom', path: [field], message: `${field} is required when IOL_ENABLED=true` });
    }
  }

  if (config.IOL_BASE_URL) {
    const hostname = new URL(config.IOL_BASE_URL).hostname.toLowerCase();
    if (hostname === 'api.invertironline.com') {
      context.addIssue({ code: 'custom', path: ['IOL_BASE_URL'], message: 'Production IOL API is forbidden during development; configure the official sandbox URL' });
    }
  }
});
export type AppConfig = z.infer<typeof envSchema>;
export const loadConfig = (source: NodeJS.ProcessEnv = process.env): AppConfig => envSchema.parse(source);
