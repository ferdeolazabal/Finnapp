import { describe, expect, it } from 'vitest';
import { loadConfig } from '../src/config/env.js';

const baseEnv = {
  DATABASE_URL: 'postgresql://trading:test@localhost:5432/trading_ai',
};

describe('environment configuration', () => {
  it('starts with IOL disconnected', () => {
    const config = loadConfig({ ...baseEnv, IOL_ENABLED: 'false' });
    expect(config).toMatchObject({ IOL_ENABLED: false, IOL_ENVIRONMENT: 'sandbox', IOL_API_VERSION: 'v2' });
  });

  it('requires complete sandbox credentials when IOL is enabled', () => {
    expect(() => loadConfig({ ...baseEnv, IOL_ENABLED: 'true' })).toThrow();
  });

  it('rejects the production API host', () => {
    expect(() => loadConfig({
      ...baseEnv,
      IOL_ENABLED: 'true',
      IOL_BASE_URL: 'https://api.invertironline.com',
      IOL_USERNAME: 'user',
      IOL_PASSWORD: 'secret',
    })).toThrow(/Production IOL API is forbidden/);
  });

  it('accepts a configured sandbox host', () => {
    const config = loadConfig({
      ...baseEnv,
      IOL_ENABLED: 'true',
      IOL_BASE_URL: 'https://sandbox.example.test',
      IOL_USERNAME: 'user',
      IOL_PASSWORD: 'secret',
    });
    expect(config.IOL_ENABLED).toBe(true);
  });
});
