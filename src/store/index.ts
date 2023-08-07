import HttpModule from "@/store/modules/HttpModule";
import ArchwayHttpModule from "@/store/modules/ArchwayModule";
import Mutations from "./Mutations";
import UserModule from "@/store/modules/UserModule";
import type { InjectionKey } from "vue";
import { State, StateInterface } from "./State";
import { createStore, useStore as baseUseStore, Store } from "vuex";

export type StoreType = Store<StateInterface>;

export const key: InjectionKey<StoreType> = Symbol();

export const store = createStore<StateInterface>({
  mutations: new Mutations(),
  state: new State(),
  modules: {
    HttpModule: new HttpModule(),
    UserModule: new UserModule(),
    ArchwayHttpModule: new ArchwayHttpModule(),
  },
});

export function useStore(): StoreType {
  return baseUseStore(key);
}
