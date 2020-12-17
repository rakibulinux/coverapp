import config from '@/config';
import { PublicController } from '..';
import { IStore } from './store';

export default class GettersSetters {
  store!: IStore;

  get market(): ZTypes.Market {
    return this.store.market;
  }

  set market(market: ZTypes.Market) {
    this.store.market = market;
  }

  get ticker() {
    return PublicController.tickers[this.market.id];
  }

  get trades() {
    return this.store.trades;
  }

  set trades(trades : ZTypes.PublicTrade[]) {
    this.store.trades = trades;
    this.store.trades = this.store.trades.sort((a, b) => b.id - a.id);

    const latest_trade = trades[0];

    document.title = `${latest_trade.price} - ${(
      this.market.name
    ).toUpperCase()} - ${config.nameEX}`;
  }
}
