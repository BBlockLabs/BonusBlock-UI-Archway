import type Chain from "@/common/Chain";
import type { Mutation, MutationTree } from "vuex";
import type { Plugins } from "@/common/Plugins";
import type { StateInterface } from "./State";

interface MutationsInterface extends MutationTree<StateInterface> {
  addChain: Mutation<StateInterface> &
    ((state: StateInterface, payload: Chain) => void);

  setLoading: Mutation<StateInterface> &
    ((state: StateInterface, loading: boolean | null) => void);

  addPlugin: Mutation<StateInterface> &
    ((state: StateInterface, plugin: Plugins) => void);

  setUserCount: Mutation<StateInterface> &
    ((state: StateInterface, userCount: string) => void);

  toggleInfoPanel: Mutation<StateInterface> & ((state: StateInterface) => void);

  closeInfoPanel: Mutation<StateInterface> & ((state: StateInterface) => void);

  openInfoPanel: Mutation<StateInterface> & ((state: StateInterface) => void);
}

export default class Mutations implements MutationsInterface {
  [key: string]: Mutation<StateInterface>;

  addChain = (state: StateInterface, payload: Chain): void => {
    state.chains = state.chains.filter(
      (chain: Chain) => chain.id !== payload.id
    );

    state.chains.push(payload);
  };

  setLoading = (
    state: StateInterface,
    loading: boolean | null = null
  ): void => {
    if (null === loading) {
      state.loading = !state.loading;
    } else {
      state.loading = loading;
    }
  };

  addPlugin = (state: StateInterface, plugin: Plugins): void => {
    state.plugins.push(plugin);
  };

  setUserCount = (state: StateInterface, userCount: string): void => {
    state.userCount = userCount;

    localStorage.setItem("userCount", userCount);
  };

  toggleInfoPanel = (state: StateInterface): void => {
    state.infoPanelOpen = !state.infoPanelOpen;
    localStorage.setItem(
      "infoPanelOpen",
      state.infoPanelOpen ? "true" : "false"
    );
  };

  closeInfoPanel = (state: StateInterface): void => {
    state.infoPanelOpen = false;
    localStorage.setItem(
      "infoPanelOpen",
      state.infoPanelOpen ? "true" : "false"
    );
  };

  openInfoPanel = (state: StateInterface): void => {
    state.infoPanelOpen = true;
    localStorage.setItem(
      "infoPanelOpen",
      state.infoPanelOpen ? "true" : "false"
    );
  };
}
