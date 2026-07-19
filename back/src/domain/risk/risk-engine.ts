import { Decimal } from 'decimal.js';
import type { Portfolio } from '../market.js';

export type RiskRules = {
  maxRiskPerTradePct: string; maxDailyLossPct: string; maxCompanyExposurePct: string;
  maxSectorExposurePct: string; maxOpenPositions: number; maxTradingCapitalPct: string;
  requireStop: boolean; minRiskRewardRatio: string; allowMarketOrders: false; requireHumanApproval: true;
};
export const EXAMPLE_RISK_RULES: RiskRules = {
  maxRiskPerTradePct: '1', maxDailyLossPct: '2', maxCompanyExposurePct: '20', maxSectorExposurePct: '35',
  maxOpenPositions: 10, maxTradingCapitalPct: '30', requireStop: true, minRiskRewardRatio: '2',
  allowMarketOrders: false, requireHumanApproval: true,
};
export type TradeRiskInput = { equity: string; entryPrice: string; stopPrice?: string; targetPrice?: string; quantity: string; orderType: 'LIMIT' | 'MARKET'; dailyNetPnL: string; dataAsOf: string; now?: string };
export type RiskResult = { approved: boolean; violations: string[]; maximumLoss?: string; riskRewardRatio?: string };

export class RiskEngine {
  constructor(private readonly rules: RiskRules, private readonly maxDataAgeSeconds: number) {}
  validateTrade(input: TradeRiskInput): RiskResult {
    const violations: string[] = [];
    const now = new Date(input.now ?? new Date().toISOString());
    const asOf = new Date(input.dataAsOf);
    if (!Number.isFinite(asOf.getTime()) || now.getTime() - asOf.getTime() > this.maxDataAgeSeconds * 1000) violations.push('STALE_OR_INVALID_DATA');
    if (input.orderType === 'MARKET') violations.push('MARKET_ORDERS_DISABLED');
    if (this.rules.requireStop && !input.stopPrice) violations.push('STOP_REQUIRED');
    const equity = new Decimal(input.equity); const entry = new Decimal(input.entryPrice); const quantity = new Decimal(input.quantity);
    if (equity.lte(0) || entry.lte(0) || quantity.lte(0)) violations.push('INVALID_NUMERIC_INPUT');
    let maximumLoss: string | undefined; let riskRewardRatio: string | undefined;
    if (input.stopPrice) {
      const stop = new Decimal(input.stopPrice); const riskPerUnit = entry.minus(stop).abs();
      maximumLoss = riskPerUnit.mul(quantity).toDecimalPlaces(2).toString();
      if (equity.gt(0) && new Decimal(maximumLoss).div(equity).mul(100).gt(this.rules.maxRiskPerTradePct)) violations.push('MAX_RISK_PER_TRADE_EXCEEDED');
      if (input.targetPrice && riskPerUnit.gt(0)) {
        riskRewardRatio = new Decimal(input.targetPrice).minus(entry).abs().div(riskPerUnit).toDecimalPlaces(4).toString();
        if (new Decimal(riskRewardRatio).lt(this.rules.minRiskRewardRatio)) violations.push('MIN_RISK_REWARD_NOT_MET');
      } else violations.push('TARGET_REQUIRED_FOR_RISK_REWARD');
    }
    if (new Decimal(input.dailyNetPnL).lt(equity.mul(this.rules.maxDailyLossPct).div(100).neg())) violations.push('MAX_DAILY_LOSS_EXCEEDED');
    return { approved: violations.length === 0, violations, ...(maximumLoss ? { maximumLoss } : {}), ...(riskRewardRatio ? { riskRewardRatio } : {}) };
  }
  analyzeConcentration(portfolio: Portfolio) {
    const values = portfolio.positions.map((p) => ({ ...p, value: new Decimal(p.quantity).mul(p.currentPrice) }));
    const total = values.reduce((sum, p) => sum.plus(p.value), new Decimal(0));
    return values.map((p) => ({ symbol: p.symbol, market: p.market, exposurePct: total.eq(0) ? '0' : p.value.div(total).mul(100).toDecimalPlaces(4).toString(), exceedsCompanyLimit: total.gt(0) && p.value.div(total).mul(100).gt(this.rules.maxCompanyExposurePct) }));
  }
}
