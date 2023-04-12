import type { Getter, GetterTree } from "vuex";
import type { StateInterface } from "@/store/State";
import type { Plugins } from "@/common/Plugins";

export type AppGetter = Getter<StateInterface, StateInterface>;

export interface GettersInterface
  extends GetterTree<StateInterface, StateInterface> {
  isPluginEnabled: AppGetter &
    ((state: StateInterface) => (plugin: Plugins) => boolean);
}

export default class Getters implements GettersInterface {
  isPluginEnabled =
    (state: StateInterface) =>
    (plugin: Plugins): boolean => {
      return state.plugins.includes(plugin);
    };

  [key: string]: Getter<StateInterface, StateInterface>;
}
