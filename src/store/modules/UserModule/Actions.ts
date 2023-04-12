  import KeplrCheckResponseRequest from "@/common/api/KeplrCheckResponseRequest";
import KeplrLoginSignDoc, {
  LoginSignOptions,
} from "@/common/KeplrLoginSignDoc";
import KeplrUnlinkWalletRequest from "@/common/api/KeplrUnlinkWalletRequest";
import User from "@/store/entity/User";
import Wallet from "@/store/entity/Wallet";
import detectEthereumProvider from "@metamask/detect-provider";
import moment from "moment";
import LinkActionPayload from "@/common/LinkActionPayload";
import type LoginResponse from "@/common/api/LoginResponse";
import type WalletDto from "@/common/api/dto/WalletDto";
import type { Action, ActionContext, ActionTree, Store } from "vuex";
import type { StateInterface as RootStateInterface } from "@/store/State";
import type { StateInterface } from "./State";
import type {
  AminoSignResponse,
  ChainInfo,
  Keplr,
  OfflineAminoSigner,
} from "@keplr-wallet/types";
import FormattedError from "@/common/errors/FormattedError";
import NoKeplrAccountsError from "@/common/errors/NoKeplrAccountsError";
import MetamaskConnectRequest from "@/common/api/MetamaskConnectRequest";
import { Plugins } from "@/common/Plugins";
import MetamaskClient from "@/common/MetamaskClient";
import Chain from "@/common/Chain";

export type Context = ActionContext<StateInterface, RootStateInterface>;
export type UserAction = Action<StateInterface, RootStateInterface>;

export interface ActionsInterface
  extends ActionTree<StateInterface, RootStateInterface> {
  getStatus: UserAction &
    ((
      this: Store<RootStateInterface>,
      context: Context,
      retryCount: number
    ) => Promise<void>);

  keplrLogin: UserAction &
    ((
      this: Store<RootStateInterface>,
      context: Context,
      payload: LinkActionPayload
    ) => Promise<void>);

  keplrUnlink: UserAction &
    ((
      this: Store<RootStateInterface>,
      context: Context,
      payload: Wallet
    ) => Promise<boolean>);

  metamaskLogin: UserAction &
    ((
      this: Store<RootStateInterface>,
      context: Context,
      referralId: string | null
    ) => Promise<void>);

  logout: UserAction &
    ((this: Store<RootStateInterface>, context: Context) => Promise<void>);

  keplrBonusBlockLogin: UserAction &
    ((this: Store<RootStateInterface>, context: Context) => Promise<void>);

  setLoginResponseData: UserAction &
    ((context: Context, loginResponse: LoginResponse) => Promise<void>);
  removeSession: UserAction & ((context: Context) => void);
}

export default class Actions implements ActionsInterface {
  [key: string]: Action<StateInterface, RootStateInterface>;

  getStatus = async (
    context: Context,
    retryCount: number = 2
  ): Promise<void> => {
    if (!context.getters["loggedIn"]) {
      await context.dispatch("removeSession");

      return;
    }

    try {
      const loginResponse: LoginResponse = await context.dispatch(
        "HttpModule/getStatus",
        null,
        { root: true }
      );

      await context.dispatch("setLoginResponseData", loginResponse);
    } catch (e: any | Error) {
      if (e.message === "Not logged in") {
        await context.dispatch("removeSession");
        return;
      }

      console.error(e);

      if (retryCount > 0) {
        await context.dispatch("getStatus", retryCount - 1);
      } else {
        console.error("could not get status after 2 retries");
        await context.dispatch("logout");
      }
    }
  };

  setLoginResponseData = async (
    context: Context,
    loginResponse: LoginResponse
  ): Promise<void> => {
    const user: User = new User();

    user.userId = loginResponse.account.userId;
    user.invitedCount = loginResponse.account.invitedCount;
    user.createdOn = moment(loginResponse.account.createdOn);
    user.modifiedOn = moment(loginResponse.account.modifiedOn);

    context.commit("setUser", user);

    const wallets: Array<Wallet> = loginResponse.account.wallets.map(
      (walletDto: WalletDto) => {
        const wallet: Wallet = new Wallet();

        wallet.user = user;
        wallet.network = walletDto.network;
        wallet.address = walletDto.address;
        wallet.createdOn = moment(walletDto.createdOn);
        wallet.modifiedOn = moment(walletDto.modifiedOn);

        return wallet;
      }
    );

    wallets.forEach((wallet: Wallet) => {
      context.commit("addWallet", wallet);
    });

    context.commit("setToken", loginResponse.session.token);
    context.commit("setTokenExpire", moment(loginResponse.session.expiresOn));
    context.commit("setActiveWallet", wallets[0]);
  };

  metamaskLogin = async (
    context: Context,
    referralId: string | null
  ): Promise<void> => {
    if (!context.rootGetters.isPluginEnabled(Plugins.Metamask)) {
      throw new FormattedError(
        "MetaMask extension not found. Enable or install it first and reload the page."
      );
    }

    const provider: any = await detectEthereumProvider({
      mustBeMetaMask: true,
      silent: true,
    });

    const chainId = await provider.request({ method: "eth_chainId" });

    const accounts: Array<string> = await MetamaskClient.requestAccounts(
      provider
    );

    const existingWallet: Wallet | undefined = context.state.wallets.find(
      (wallet) =>
        wallet.network === `eth-${chainId}` && wallet.address === accounts[0]
    );

    if (existingWallet !== undefined) {
      throw new FormattedError(
        "Wallet already connected, please switch network or account and try again."
      );
    }

    const nonce: string = crypto.randomUUID();

    const ticket: string = await context.dispatch(
      "HttpModule/getAuthTicket",
      nonce,
      { root: true }
    );

    const signedMessage: string = await MetamaskClient.signMessage(provider, [
      ticket,
      accounts[0],
    ]);

    const loginResponse: LoginResponse = await context.dispatch(
      "HttpModule/connectEthereum",
      new MetamaskConnectRequest(
        `eth-${chainId}`,
        signedMessage,
        nonce,
        referralId
      ),
      { root: true }
    );

    await context.dispatch("setLoginResponseData", loginResponse);
  };

  keplrBonusBlockLogin = async (context: Context): Promise<void> => {
    if (!window.keplr) {
      throw new FormattedError(
        "Keplr extension not reachable. Enable or install it first and reload the page."
      );
    }

    const keplr: Keplr = window.keplr;
    const chainData: ChainInfo = JSON.parse(
      import.meta.env.VITE_BONUSBLOCK_KEPLR_CONFIG
    ) as ChainInfo;
    const chain: Chain = new Chain();

    try {
      await keplr.experimentalSuggestChain(chainData);
    } catch (error: any | Error) {
      throw new FormattedError(
        `Could not authorize against BonusBlock network`
      );
    }

    chain.name = chainData.chainName;
    chain.id = chainData.chainId;
    chain.denom = chainData.currencies[0].coinDenom;

    await context.dispatch("keplrLogin", new LinkActionPayload(chain));
  };

  keplrLogin = async (
    context: Context,
    payload: LinkActionPayload
  ): Promise<void> => {
    if (!window.keplr) {
      throw new FormattedError(
        "Keplr extension not reachable. Enable or install it first and reload the page."
      );
    }

    const keplr: Keplr = window.keplr;

    try {
      await keplr.enable(payload.chain.id);
    } catch (error: any | Error) {
      throw new FormattedError(
        `Could not authorize against network ${payload.chain.id}`
      );
    }

    const offlineSigner: OfflineAminoSigner =
      await keplr.getOfflineSignerOnlyAmino(payload.chain.id);

    const accounts = await offlineSigner.getAccounts();

    if (accounts.length === 0) {
      throw new NoKeplrAccountsError();
    }

    const nonce: string = crypto.randomUUID();

    const ticket: string = await context.dispatch(
      "HttpModule/getAuthTicket",
      nonce,
      { root: true }
    );

    let signResponse: AminoSignResponse;

    try {
      signResponse = await window.keplr.signAmino(
        payload.chain.id,
        accounts[0].address,
        new KeplrLoginSignDoc(payload.chain.id, payload.chain.denom, ticket),
        new LoginSignOptions()
      );
    } catch (error: any | Error) {
      if (error.message === "Request rejected") {
        throw new FormattedError("Sign request rejected, can't connect.");
      } else {
        console.error(error);

        throw new FormattedError("Could not sign the connection request");
      }
    }

    const loginResponse: LoginResponse = await context.dispatch(
      "HttpModule/keplrCheckResponse",
      new KeplrCheckResponseRequest(
        JSON.stringify(signResponse),
        nonce,
        payload.referral
      ),
      { root: true }
    );

    await context.dispatch("setLoginResponseData", loginResponse);
  };

  keplrUnlink = async (context: Context, wallet: Wallet): Promise<boolean> => {
    await context.dispatch(
      "HttpModule/keplrUnlinkWallet",
      new KeplrUnlinkWalletRequest(wallet.network, wallet.address),
      { root: true }
    );

    context.commit("removeWallet", wallet);

    return true;
  };

  removeSession = (context: Context): void => {
    context.commit("setToken", null);
    context.commit("setTokenExpire", null);
    context.commit("setActiveWallet", null);
    context.commit("setUser", null);
    context.commit("resetWallets", null);
  };

  logout = async (context: Context): Promise<void> => {
    try {
      await context.dispatch("HttpModule/terminateSession", null, {
        root: true,
      });
    } catch (e) {
      return;
    } finally {
      await context.dispatch("removeSession");
    }
  };
}
