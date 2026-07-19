import type { BrokerProvider } from '../../domain/broker-provider.js';
import type { AccountBalance, BrokerOrder, HistoricalPriceRequest, Portfolio, PriceBar, Quote } from '../../domain/market.js';
export type MockBrokerFixture = { balance: AccountBalance; portfolio: Portfolio; quotes: Quote[]; bars?: PriceBar[]; orders?: BrokerOrder[] };
export class MockBrokerProvider implements BrokerProvider {
  constructor(private readonly fixture: MockBrokerFixture) {}
  async getAccountBalance() { return structuredClone(this.fixture.balance); }
  async getPortfolio() { return structuredClone(this.fixture.portfolio); }
  async getQuote(symbol: string, market: string) {
    const quote = this.fixture.quotes.find((q) => q.symbol === symbol && q.market === market);
    if (!quote) throw new Error(`Quote unavailable for ${market}:${symbol}`);
    return structuredClone(quote);
  }
  async getHistoricalPrices(params: HistoricalPriceRequest) {
    void params;
    return structuredClone(this.fixture.bars ?? []);
  }
  async getOrders() { return structuredClone(this.fixture.orders ?? []); }
}
