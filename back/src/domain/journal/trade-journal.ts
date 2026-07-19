export type TradeSide = 'BUY' | 'SELL';
export type TradeJournalEntry = {
  id: string; symbol: string; market: string; occurredAt: string; side: TradeSide;
  entryPrice: string; exitPrice?: string; quantity: string; commissions: string;
  grossPnL?: string; netPnL?: string; originalStop: string; originalTarget: string;
  entryRationale: string; exitRationale?: string; originalThesis: string; invalidationCondition: string;
  emotionalState?: string; detectedErrors: string[]; lessonsLearned?: string; aiAnalysis?: string;
  strategy?: string; createdAt: string; updatedAt: string;
};
export type NewTradeJournalEntry = Omit<TradeJournalEntry, 'id' | 'createdAt' | 'updatedAt'>;
export interface TradeJournalRepository { list(): Promise<TradeJournalEntry[]>; save(entry: NewTradeJournalEntry): Promise<TradeJournalEntry>; }

