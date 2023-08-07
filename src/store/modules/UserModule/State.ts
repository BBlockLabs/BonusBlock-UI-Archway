import type {Moment} from "moment";
import moment from "moment";
import type User from "@/store/entity/User";
import type Wallet from "@/store/entity/Wallet";

export interface StateInterface {
  token: string | null;
  tokenExpire: Moment | null;
  user: User | null;
  wallets: Array<Wallet>;
  activeWallet: Wallet | null;
  loggedInWith: string | null;
}

export default class State implements StateInterface {
  token: string | null = null;
  tokenExpire: Moment | null = null;
  user: User | null = null;
  wallets: Array<Wallet> = [];
  activeWallet: Wallet | null = null;
  loggedInWith: string | null = null;

  constructor() {
    const localToken: string | null = localStorage.getItem("token");
    const localTokenExpire: string | null = localStorage.getItem("tokenExpire");
    this.loggedInWith = localStorage.getItem("loggedInWith");

    if (localTokenExpire !== null && localToken !== null) {
      const expireMoment: Moment = moment(localTokenExpire);

      if (!expireMoment.isBefore(moment())) {
        this.tokenExpire = moment(localTokenExpire);
        this.token = localToken;
      }
    }
  }
}
