import type { Getter, GetterTree } from "vuex";
import type { StateInterface } from "./State";
import type { StateInterface as RootStateInterface } from "@/store/State";
import type User from "@/store/entity/User";
import moment from "moment";

export type UserGetter = Getter<StateInterface, RootStateInterface>;

export interface GettersInterface
  extends GetterTree<StateInterface, RootStateInterface> {
  getUser: UserGetter & ((state: StateInterface) => User | null);
  refLink: UserGetter & ((state: StateInterface) => string | null);
  loggedIn: UserGetter & ((state: StateInterface) => boolean);
}

export default class Getters implements GettersInterface {
  getUser = (state: StateInterface): User | null => {
    return state.user;
  };
  refLink = (state: StateInterface): string | null => {
    return `${window.location.origin}?r=${state.user?.userId}`;
  };

  loggedIn = (state: StateInterface): boolean => {
    const token = state.token;
    const tokenExpire = state.tokenExpire;

    if (token === null || tokenExpire === null) {
      return false;
    }

    if (tokenExpire.isBefore(moment())) {
      return false;
    }

    if (!localStorage.getItem("token")) {
      return false;
    }

    return true;
  };

  [key: string]: Getter<StateInterface, RootStateInterface>;
}
