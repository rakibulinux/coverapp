import { ActionTree } from "vuex";

const RebuildJSON = (json: string[]) => {
  json = json.filter(e => !!e);
  return json;
};

const actions: ActionTree<WebSocketState, RootState> = {
};

export default actions;
