import { describe, expect, it } from 'vitest';
import { MockBrokerProvider } from '../src/infrastructure/broker/mock-broker-provider.js';
const asOf = '2026-01-01T00:00:00.000Z';
describe('MockBrokerProvider', () => {
  const broker = new MockBrokerProvider({ balance: { asOf, currency: 'ARS', available: '100', total: '100' }, portfolio: { asOf, currency: 'ARS', positions: [] }, quotes: [{ asOf, symbol: 'GGAL', market: 'BCBA', currency: 'ARS', last: '100' }] });
  it('returns fixtures', async () => expect((await broker.getQuote('GGAL', 'BCBA')).last).toBe('100'));
  it('never invents a quote', async () => expect(broker.getQuote('NONE', 'BCBA')).rejects.toThrow('Quote unavailable'));
});

