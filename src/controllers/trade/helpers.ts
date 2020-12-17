import { IStore } from './store';

export default class Helpers {
  store: IStore;

  constructor(store: IStore) {
    this.store = store;
  }
}
