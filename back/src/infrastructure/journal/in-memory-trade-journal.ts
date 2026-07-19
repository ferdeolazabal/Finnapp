import { randomUUID } from 'node:crypto';
import type { NewTradeJournalEntry, TradeJournalEntry, TradeJournalRepository } from '../../domain/journal/trade-journal.js';
export class InMemoryTradeJournalRepository implements TradeJournalRepository {
  private readonly entries: TradeJournalEntry[] = [];
  async list() { return structuredClone(this.entries); }
  async save(input: NewTradeJournalEntry) {
    const now = new Date().toISOString(); const entry = { ...structuredClone(input), id: randomUUID(), createdAt: now, updatedAt: now };
    this.entries.push(entry); return structuredClone(entry);
  }
}

