import type { Mutation, MutationTree } from "vuex";
import type { StateInterface } from "./State";
import type User from "@/store/entity/User";
import type Wallet from "@/store/entity/Wallet";
import type { Moment } from "moment";

interface MutationsInterface extends MutationTree<StateInterface> {
  setToken: Mutation<StateInterface> &
    ((state: StateInterface, token: string | null) => void);

  setTokenExpire: Mutation<StateInterface> &
    ((state: StateInterface, expire: Moment | null) => void);

  setUser: Mutation<StateInterface> &
    ((state: StateInterface, User: User | null) => void);

  addWallet: Mutation<StateInterface> &
    ((state: StateInterface, wallet: Wallet) => void);

  removeWallet: Mutation<StateInterface> &
    ((state: StateInterface, wallet: Wallet) => void);

  resetWallets: Mutation<StateInterface> & ((state: StateInterface) => void);

  setActiveWallet: Mutation<StateInterface> &
    ((state: StateInterface, wallet: Wallet) => void);
}

export default class Mutations implements MutationsInterface {
  [key: string]: Mutation<StateInterface>;

  setToken = (state: StateInterface, token: string | null): void => {
    if (token !== null) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }

    state.token = token;
  };

  setTokenExpire = (state: StateInterface, expire: Moment | null): void => {
    if (expire !== null) {
      localStorage.setItem("tokenExpire", expire.toISOString());
    } else {
      localStorage.removeItem("tokenExpire");
    }

    state.tokenExpire = expire;
  };

  setUser = (state: StateInterface, user: User | null): void => {
    state.user = user;
  };

  addWallet = (state: StateInterface, wallet: Wallet): void => {
    state.wallets = state.wallets.filter((stateWallet) => {
      return (
        stateWallet.network !== wallet.network ||
        stateWallet.address !== wallet.address
      );
    });

    state.wallets.push(wallet);
  };

  removeWallet = (state: StateInterface, wallet: Wallet): void => {
    state.wallets = state.wallets.filter((stateWallet) => {
      return (
        stateWallet.network !== wallet.network ||
        stateWallet.address !== wallet.address
      );
    });
  };

  resetWallets = (state: StateInterface): void => {
    state.wallets = [];
  };

  setActiveWallet = (state: StateInterface, wallet: Wallet): void => {
    state.activeWallet = wallet;
  };
}
