type Side = ZTypes.TakerType;

import { TradeController } from '@/controllers/trade';
import { PublicController } from '@/controllers/public';
import { UserController } from '@/controllers/user';
import { WebSocketController } from '@/controllers/websocket';

declare module "vue/types/vue" {
  interface Vue {
    PublicController: PublicController;
    TradeController: TradeController;
    UserController: UserController;
    WebSocketController: WebSocketController;
  }
}
