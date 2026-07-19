import { Agent } from '@openai/agents';
import type { BrokerProvider } from '../domain/broker-provider.js';
import type { TradeJournalRepository } from '../domain/journal/trade-journal.js';
import type { RiskEngine } from '../domain/risk/risk-engine.js';
import { tradeAnalysisSchema } from '../domain/trade-analysis.js';
import { createReadOnlyTools } from './tools.js';

export const createTradingAuditorAgent = (
  broker: BrokerProvider,
  journal: TradeJournalRepository,
  risk: RiskEngine,
) => new Agent({
  name: 'Trading Auditor',
  instructions: 'Act as a cautious trading auditor. Use tools for every numeric or account fact. Never invent market data or execute orders. Every proposal requires human approval.',
  tools: createReadOnlyTools(broker, journal, risk),
  outputType: tradeAnalysisSchema,
});
