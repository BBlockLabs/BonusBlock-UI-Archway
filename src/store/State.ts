import type { StateInterface as UserModule } from "@/store/modules/UserModule/State";
import type ArchwayProductDto from "@/common/api/archway/ArchwayProductDto";
import ArchwayStatsDto from "@/common/api/archway/ArchwayStatsDto";

export interface StateInterface {
  archwayProducts: Array<ArchwayProductDto>;
  archwayStats: ArchwayStatsDto;
  UserModule?: UserModule;
  loading: boolean;
  infoPanelOpen: boolean;
}

export class State implements StateInterface {
  archwayProducts = [];
  archwayStats = new ArchwayStatsDto();
  loading: boolean = false;
  infoPanelOpen: boolean = true;

  constructor() {
    const infoPanelOpen: string | null = localStorage.getItem("infoPanelOpen");

    if (infoPanelOpen === null) {
      this.infoPanelOpen = true;
    } else {
      this.infoPanelOpen = infoPanelOpen === "true";
    }
  }
}
