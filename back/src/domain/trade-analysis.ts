import { z } from 'zod';
export const tradeAnalysisSchema = z.object({
  symbol: z.string().min(1), market: z.string().min(1),
  suggestedAction: z.enum(['BUY', 'SELL', 'HOLD', 'REDUCE', 'AVOID']),
  thesis: z.string(), supportingEvidence: z.array(z.string()), risks: z.array(z.string()),
  invalidationConditions: z.array(z.string()), currentPrice: z.number().optional(),
  proposedEntryPrice: z.number().optional(), stopPrice: z.number().optional(), targetPrice: z.number().optional(),
  suggestedQuantity: z.number().optional(), maximumEstimatedLoss: z.number().optional(), riskRewardRatio: z.number().optional(),
  confidence: z.enum(['LOW', 'MEDIUM', 'HIGH']), dataTimestamp: z.string().datetime(),
  requiresHumanApproval: z.literal(true),
});
export type TradeAnalysis = z.infer<typeof tradeAnalysisSchema>;

