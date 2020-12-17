import GettersSetters from './getters_setters';
import { IStore } from './store';

export default class Helpers extends GettersSetters {
  store: IStore;

  constructor(store: IStore) {
    super();

    this.store = store;
  }

  check_favorite = (market_id: string) => {
    market_id = market_id.replace("/", "").toLowerCase();
  
    return this.store.favorites.includes(market_id);
  }

  add_remove_favorite = (market_id: string) => {
    market_id = market_id.replace("/", "").toLowerCase();

    const index = this.favorites.findIndex(market => market == market_id);

    if (index >= 0) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push(market_id);
    }

  }
}
