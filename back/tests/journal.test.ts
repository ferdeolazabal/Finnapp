import { describe, expect, it } from 'vitest';
import { InMemoryTradeJournalRepository } from '../src/infrastructure/journal/in-memory-trade-journal.js';
describe('journal', () => {
  it('creates a traceable entry', async () => {
    const repo = new InMemoryTradeJournalRepository();
    await repo.save({ symbol: 'GGAL', market: 'BCBA', occurredAt: '2026-01-01T00:00:00.000Z', side: 'BUY', entryPrice: '100', quantity: '1', commissions: '1', originalStop: '95', originalTarget: '110', entryRationale: 'Test', originalThesis: 'Thesis', invalidationCondition: 'Stop', detectedErrors: [] });
    expect((await repo.list())[0]?.id).toBeTruthy();
  });
});

