import type Chain from "@/common/Chain";
import type { Plugins } from "@/common/Plugins";
import type { StateInterface as UserModule } from "@/store/modules/UserModule/State";

export interface StateInterface {
  chains: Array<Chain>;
  UserModule?: UserModule;
  loading: boolean;
  plugins: Array<Plugins>;
  userCount: string;
  infoPanelOpen: boolean;
}

export class State implements StateInterface {
  chains = [];
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
