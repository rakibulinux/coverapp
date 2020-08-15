import OrdersManager from "./orders_manager";
import TradesManager from "./trades_manager";

export default class MineControl {
  open_orders: OrdersManager;
  orders_history: OrdersManager;
  trades_history: TradesManager;

  create_mine_control() {
    this.open_orders = new OrdersManager("All", "wait");
    this.orders_history = new OrdersManager("All", "All");
    this.trades_history = new TradesManager("All");
  }
}
