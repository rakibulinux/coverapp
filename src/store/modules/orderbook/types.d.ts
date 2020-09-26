export interface OrderBookState {
  asks: Array<{ price: number; amount: number }>;
  bids: Array<{ price: number; amount: number }>;
}
