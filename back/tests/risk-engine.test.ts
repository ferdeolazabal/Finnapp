import { describe, expect, it } from 'vitest';
import { EXAMPLE_RISK_RULES, RiskEngine } from '../src/domain/risk/risk-engine.js';
describe('RiskEngine', () => {
  const engine = new RiskEngine(EXAMPLE_RISK_RULES, 300);
  it('fails closed for stale data and market orders', () => {
    const result = engine.validateTrade({ equity: '10000', entryPrice: '100', stopPrice: '95', targetPrice: '110', quantity: '10', orderType: 'MARKET', dailyNetPnL: '0', dataAsOf: '2026-01-01T00:00:00.000Z', now: '2026-01-01T01:00:00.000Z' });
    expect(result.approved).toBe(false);
    expect(result.violations).toEqual(expect.arrayContaining(['STALE_OR_INVALID_DATA', 'MARKET_ORDERS_DISABLED']));
  });
  it('accepts complete data within example limits', () => {
    const result = engine.validateTrade({ equity: '10000', entryPrice: '100', stopPrice: '95', targetPrice: '110', quantity: '10', orderType: 'LIMIT', dailyNetPnL: '0', dataAsOf: '2026-01-01T00:00:00.000Z', now: '2026-01-01T00:01:00.000Z' });
    expect(result).toMatchObject({ approved: true, maximumLoss: '50', riskRewardRatio: '2' });
  });
});

