import type Chain from "@/common/Chain";
import type { Plugins } from "@/common/Plugins";
import type { StateInterface as UserModule } from "@/store/modules/UserModule/State";
import type ArchwayProductDto from "@/common/api/archway/ArchwayProductDto";
import ArchwayStatsDto from "@/common/api/archway/ArchwayStatsDto";

export interface StateInterface {
  chains: Array<Chain>;
  archwayProducts: Array<ArchwayProductDto>;
  archwayStats: ArchwayStatsDto;
  UserModule?: UserModule;
  loading: boolean;
  plugins: Array<Plugins>;
  userCount: string;
  infoPanelOpen: boolean;
}

export class State implements StateInterface {
  chains = [];
  archwayProducts = [];
  archwayStats = new ArchwayStatsDto();
  loading: boolean = false;
  plugins: Array<Plugins> = [];
  userCount: string = import.meta.env.VITE_USER_COUNT;
  infoPanelOpen: boolean = true;

  constructor() {
    const userCount: string | null = localStorage.getItem("userCount");
    const infoPanelOpen: string | null = localStorage.getItem("infoPanelOpen");

    if (infoPanelOpen === null) {
      this.infoPanelOpen = true;
    } else {
      this.infoPanelOpen = infoPanelOpen === "true";
    }

    if (userCount !== null) {
      this.userCount = userCount;
    }
  }
}
