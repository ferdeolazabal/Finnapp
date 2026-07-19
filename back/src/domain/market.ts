export type Money = string;
export type MarketData = { asOf: string };
export type AccountBalance = MarketData & { currency: string; available: Money; total: Money };
export type Position = { symbol: string; market: string; quantity: string; averagePrice: Money; currentPrice: Money; sector?: string };
export type Portfolio = MarketData & { currency: string; positions: Position[] };
export type Quote = MarketData & { symbol: string; market: string; currency: string; bid?: Money; ask?: Money; last: Money };
export type HistoricalPriceRequest = { symbol: string; market: string; from: string; to: string; interval: '1d' };
export type PriceBar = { timestamp: string; open: Money; high: Money; low: Money; close: Money; volume: string };
export type BrokerOrder = { id: string; symbol: string; market: string; side: 'BUY' | 'SELL'; status: string; createdAt: string };

