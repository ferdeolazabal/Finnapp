import { Decimal } from 'decimal.js';
export const calculateNetPnL = (entryPrice: string, exitPrice: string, quantity: string, commissions: string) =>
  new Decimal(exitPrice).minus(entryPrice).mul(quantity).minus(commissions).toDecimalPlaces(2).toString();
export const calculatePositionSize = (equity: string, riskPct: string, entryPrice: string, stopPrice: string) => {
  const perUnit = new Decimal(entryPrice).minus(stopPrice).abs();
  if (perUnit.eq(0)) throw new Error('Entry and stop prices must differ');
  return new Decimal(equity).mul(riskPct).div(100).div(perUnit).floor().toString();
};
