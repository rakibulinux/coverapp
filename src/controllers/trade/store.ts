import Vue from "vue";
import VueCompositionAPI, { reactive } from "@vue/composition-api";

Vue.use(VueCompositionAPI);

export type ExchangeLayout = "basic" | "pro";
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
	exchange_layout: ExchangeLayout;
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
		trades_history: [],
		exchange_layout: (localStorage.getItem("exchange_layout") as ExchangeLayout) || "basic",
	});
}

export default new Store().store;
