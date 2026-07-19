import type { AccountBalance, BrokerOrder, HistoricalPriceRequest, Portfolio, PriceBar, Quote } from './market.js';
export interface BrokerProvider {
  getAccountBalance(): Promise<AccountBalance>;
  getPortfolio(): Promise<Portfolio>;
  getQuote(symbol: string, market: string): Promise<Quote>;
  getHistoricalPrices(params: HistoricalPriceRequest): Promise<PriceBar[]>;
  getOrders(): Promise<BrokerOrder[]>;
}

