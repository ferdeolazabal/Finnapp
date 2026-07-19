import { tool } from '@openai/agents';
import { z } from 'zod';
import type { BrokerProvider } from '../domain/broker-provider.js';
import type { TradeJournalRepository } from '../domain/journal/trade-journal.js';
import { calculateNetPnL, calculatePositionSize } from '../application/calculations.js';
import { RiskEngine } from '../domain/risk/risk-engine.js';

export const createReadOnlyTools = (broker: BrokerProvider, journal: TradeJournalRepository, risk: RiskEngine) => [
  tool({ name: 'get_portfolio', description: 'Get the broker portfolio with its source timestamp.', parameters: z.object({}), execute: () => broker.getPortfolio() }),
  tool({ name: 'get_account_balance', description: 'Get the account balance with its source timestamp.', parameters: z.object({}), execute: () => broker.getAccountBalance() }),
  tool({ name: 'get_quote', description: 'Get a timestamped quote. Never infer a missing quote.', parameters: z.object({ symbol: z.string().min(1), market: z.string().min(1) }), execute: ({ symbol, market }) => broker.getQuote(symbol, market) }),
  tool({ name: 'get_historical_prices', description: 'Get timestamped daily historical bars.', parameters: z.object({ symbol: z.string(), market: z.string(), from: z.string().datetime(), to: z.string().datetime(), interval: z.literal('1d') }), execute: (params) => broker.getHistoricalPrices(params) }),
  tool({ name: 'calculate_net_pnl', description: 'Deterministically calculate net PnL after commissions.', parameters: z.object({ entryPrice: z.string(), exitPrice: z.string(), quantity: z.string(), commissions: z.string() }), execute: ({ entryPrice, exitPrice, quantity, commissions }) => calculateNetPnL(entryPrice, exitPrice, quantity, commissions) }),
  tool({ name: 'calculate_position_size', description: 'Deterministically calculate whole-unit position size for a risk budget.', parameters: z.object({ equity: z.string(), riskPct: z.string(), entryPrice: z.string(), stopPrice: z.string() }), execute: ({ equity, riskPct, entryPrice, stopPrice }) => calculatePositionSize(equity, riskPct, entryPrice, stopPrice) }),
  tool({ name: 'analyze_portfolio_concentration', description: 'Deterministically calculate exposure and company-limit flags.', parameters: z.object({}), execute: async () => risk.analyzeConcentration(await broker.getPortfolio()) }),
  tool({ name: 'get_trade_journal', description: 'Read the trading journal. This tool never writes entries.', parameters: z.object({}), execute: () => journal.list() }),
];

