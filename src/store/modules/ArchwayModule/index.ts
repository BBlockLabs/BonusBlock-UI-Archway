import type { Module } from "vuex";
import type { StateInterface as RootStateInterface } from "@/store/State";
import Actions from "./Actions";

export default class ArchwayHttpModule implements Module<{}, RootStateInterface> {
  actions = new Actions();
  namespaced = true;
}
