import Actions from "./Actions";
import Getters from "./Getters";
import HttpModule from "@/store/modules/HttpModule";
import Mutations from "./Mutations";
import UserModule from "@/store/modules/UserModule";
import type { InjectionKey } from "vue";
import { State, StateInterface } from "./State";
import { createStore, useStore as baseUseStore, Store } from "vuex";

export type StoreType = Store<StateInterface>;

export const key: InjectionKey<StoreType> = Symbol();

export const store = createStore<StateInterface>({
  actions: new Actions(),
  getters: new Getters(),
  mutations: new Mutations(),
  state: new State(),
  modules: {
    HttpModule: new HttpModule(),
    UserModule: new UserModule(),
  },
});

export function useStore(): StoreType {
  return baseUseStore(key);
}
