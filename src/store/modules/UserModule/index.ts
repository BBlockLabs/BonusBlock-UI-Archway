import type { Module } from "vuex";

import Mutations from "./Mutations";
import Actions from "./Actions";
import Getters from "./Getters";
import State from "./State";
import type { StateInterface } from "./State";
import type { StateInterface as RootStateInterface } from "@/store/State";

export default class UserModule
  implements Module<StateInterface, RootStateInterface>
{
  state = new State();
  getters = new Getters();
  mutations = new Mutations();
  actions = new Actions();
  namespaced = true;
}
