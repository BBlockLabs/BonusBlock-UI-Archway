import type { Mutation, MutationTree } from "vuex";
import type { Plugins } from "@/common/Plugins";
import type { StateInterface } from "./State";
import type ArchwayProductDto from "@/common/api/archway/ArchwayProductDto";
import type ArchwayStatsDto from "@/common/api/archway/ArchwayStatsDto";

interface MutationsInterface extends MutationTree<StateInterface> {
  addArchwayProduct: Mutation<StateInterface> &
    ((state: StateInterface, payload: ArchwayProductDto) => void);

  setArchwayStats: Mutation<StateInterface> &
    ((state: StateInterface, payload: ArchwayStatsDto) => void);

  setLoading: Mutation<StateInterface> &
    ((state: StateInterface, loading: boolean | null) => void);

  toggleInfoPanel: Mutation<StateInterface> & ((state: StateInterface) => void);

  closeInfoPanel: Mutation<StateInterface> & ((state: StateInterface) => void);

  openInfoPanel: Mutation<StateInterface> & ((state: StateInterface) => void);
}

export default class Mutations implements MutationsInterface {
  [key: string]: Mutation<StateInterface>;

  addArchwayProduct = (state: StateInterface, payload: ArchwayProductDto): void => {
    state.archwayProducts.push(payload);
  };

  setArchwayStats = (state: StateInterface, payload: ArchwayStatsDto): void => {
    state.archwayStats = payload;
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
