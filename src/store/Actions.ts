import type { Action, ActionContext, ActionTree, Store } from "vuex";
import type { StateInterface } from "@/store/State";
import FormattedError from "@/common/errors/FormattedError";
import type { Keplr } from "@keplr-wallet/types";
import Chain from "@/common/Chain";
import { Plugins } from "@/common/Plugins";
import detectEthereumProvider from "@metamask/detect-provider";

export type Context = ActionContext<StateInterface, StateInterface>;
export type HttpAction = Action<StateInterface, StateInterface>;

export interface ActionsInterface
  extends ActionTree<StateInterface, StateInterface> {
  loadKeplrChains: HttpAction &
    ((this: Store<StateInterface>, context: Context) => Promise<void>);
  getEnabledExtensions: HttpAction &
    ((this: Store<StateInterface>, context: Context) => Promise<void>);

  getUserCount: HttpAction &
    ((this: Store<StateInterface>, context: Context) => Promise<void>);
}

export default class Actions implements ActionsInterface {
  [key: string]: Action<StateInterface, StateInterface>;

  getEnabledExtensions = async (context: Context): Promise<void> => {
    if (window.keplr) {
      context.commit("addPlugin", Plugins.Keplr);
    }

    const provider = await detectEthereumProvider();

    if (provider !== null && provider.isMetaMask) {
      context.commit("addPlugin", Plugins.Metamask);
    }
  };

  loadKeplrChains = async (context: Context): Promise<void> => {
    if (!window.keplr) {
      throw new FormattedError(
        "Keplr extension not reachable. Enable or install it first"
      );
    }

    const keplr: Keplr = window.keplr;

    const chains = await keplr.getChainInfosWithoutEndpoints();

    chains
      .map((keplrChain): Chain => {
        const chain: Chain = new Chain();

        chain.name = keplrChain.chainName;
        chain.id = keplrChain.chainId;
        chain.denom = keplrChain.currencies[0].coinMinimalDenom;
        chain.iconUrl = keplrChain.chainSymbolImageUrl;
        chain.source = "Keplr";

        return chain;
      })
      .forEach((chain: Chain) => {
        context.commit("addChain", chain);
      });
  };

  getUserCount = async (context: Context): Promise<void> => {
    try {
      const userCount: string = await context.dispatch(
        "HttpModule/getUserCount"
      );

      context.commit("setUserCount", userCount);
    } catch (e) {
      console.error(e);
    }
  };
}
