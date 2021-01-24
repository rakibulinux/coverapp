import Vue from "vue";
import VueCompositionAPI, { reactive } from "@vue/composition-api";

Vue.use(VueCompositionAPI);

export interface IStore {
	market?: ZTypes.Market;
	depth: {
		asks: {
			price: number,
			amount: number
		}[];
		bids: {
			price: number,
			amount: number
		}[];
		loading: boolean;
		sequence: number;
	};
	trades: ZTypes.PublicTrade[];
	open_orders: ZTypes.Order[];
	orders_history: ZTypes.Order[];
	trades_history: ZTypes.Trade[];
}

class Store {
	store = reactive<IStore>({
		market: null,
		depth: {
			asks: [],
			bids: [],
			loading: false,
			sequence: 0
		},
		trades: [],
		open_orders: [],
		orders_history: [],
		trades_history: []
	});
}

export default new Store().store;
