import type {AccountData, Keplr, OfflineAminoSigner} from "@keplr-wallet/types";
import { SigningArchwayClient } from "@archwayhq/arch3.js";
import type { Coin } from "@cosmjs/stargate";

export default class ArchwayKeplrClient {
  static testnetCurrency = {
    coinDenom: "CONST",
    coinMinimalDenom: "aconst",
    coinDecimals: 18,
    coinGeckoId: "constantine-network",
  };

  static mainnetCurrency = {
    coinDenom: "ARCH",
    coinMinimalDenom: "aarch",
    coinDecimals: 18,
    coinGeckoId: "archway-network",
  };

  static testnetChainInfo = {
    chainId: "constantine-3",
    chainName: "Constantine",
    rpc: "https://rpc.constantine.archway.tech",
    rest: "https://api.constantine.archway.tech",
    stakeCurrency: this.testnetCurrency,
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: "archway",
      bech32PrefixAccPub: "archwaypub",
      bech32PrefixValAddr: "archwayvaloper",
      bech32PrefixValPub: "archwayvaloperpub",
      bech32PrefixConsAddr: "archwayvalcons",
      bech32PrefixConsPub: "archwayvalconspub",
    },
    currencies: [this.testnetCurrency],
    feeCurrencies: [this.testnetCurrency],
    coinType: 118,
    features: ["cosmwasm", "ibc-transfer", "ibc-go"],
  };

  static mainnetChainInfo = {
    chainId: "archway-1",
    chainName: "Archway",
    rpc: "https://rpc.mainnet.archway.io",
    rest: "https://api.mainnet.archway.io",
    stakeCurrency: this.mainnetCurrency,
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: "archway",
      bech32PrefixAccPub: "archwaypub",
      bech32PrefixValAddr: "archwayvaloper",
      bech32PrefixValPub: "archwayvaloperpub",
      bech32PrefixConsAddr: "archwayvalcons",
      bech32PrefixConsPub: "archwayvalconspub",
    },
    currencies: [this.mainnetCurrency],
    feeCurrencies: [this.mainnetCurrency],
    coinType: 118,
    features: ["cosmwasm", "ibc-transfer", "ibc-go"],
  };

  public static get client(): Keplr {
    if (!window.keplr) {
      throw new Error("Keplr is not detected");
    }

    return window.keplr;
  }

  static async checkChain(chain: any) {
    const client: Keplr = this.client;

    try {
      await client.enable(chain.chainId);
    } catch (e) {
      await client.experimentalSuggestChain(this.getChain());
      await client.enable(chain.chainId);
    }
  }

  static async chainExists(chainId: string) {
    const client: Keplr = this.client;

    await client.enable(chainId);
  }

  static async suggestChain() {
    const client: Keplr = this.client;

    await client.experimentalSuggestChain(this.getChain());
  }

  static async getAccounts(offlineSigner: OfflineAminoSigner) {
    const ret = await offlineSigner.getAccounts();
    if (!ret) {
      throw new Error("Failed to get accounts");
    }
    return ret;
  }

  static async getOfflineSigner() {
    // @ts-ignore
    const ret = window.getOfflineSignerOnlyAmino(
      this.getChain().chainId
    );
    if (!ret) {
      console.log(
        "getOfflineSigner",
        this.getChain().chainId,
        ret
      );
    }
    return ret;
  }
  static async queryContract(
    contractAddress: string,
    queryMsg: any,
    chainId: string
  ) {
    const client: Keplr = this.client;

    client.defaultOptions = {
      sign: {
        preferNoSetFee: true,
        preferNoSetMemo: true,
      },
    };

    await client.enable(chainId);

    const signingArchwayClient = await this.getSigningClinet();

    let result;
    try {
      result = await signingArchwayClient.queryContractSmart(
        contractAddress,
        queryMsg
      );
    } catch (e) {
      console.error(e);
      throw e;
    }
    return result;
  }
  static async executeContractMsg(
    contractAddress: string,
    executeMsg: any,
    chainId: string,
    memo?: string,
    funds?: Coin[]
  ) {
    let client: Keplr;

    try {
      client = this.client;
    } catch {
      return false;
    }

    client.defaultOptions = {
      sign: {
        preferNoSetFee: true,
        preferNoSetMemo: true,
      },
    };

    await client.enable(chainId);

    const userAccounts = await this.getUserAccounts();
    const signingArchwayClient = await this.getSigningClinet();

    try {
      await signingArchwayClient.execute(
        userAccounts[0].address,
        contractAddress,
        executeMsg,
        "auto",
        memo,
        funds
      );
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  static async getArchwayClient(offlineSigner: OfflineAminoSigner) {
    return await SigningArchwayClient.connectWithSigner(
      this.getChain().rpc,
      offlineSigner
    );
  }

  static getChain() {
    const currentEnv = import.meta.env.VITE_ARCHWAY_CHAIN_ID?.toUpperCase();
    if (currentEnv === "CONSTANTINE-3") {
      return this.testnetChainInfo;
    } else {
      return this.mainnetChainInfo;
    }
  }

  static getCurrency() {
    const currentEnv = import.meta.env.VITE_ARCHWAY_CHAIN_ID?.toUpperCase();
    if (currentEnv === "CONSTANTINE-3") {
      return this.testnetCurrency;
    } else {
      return this.mainnetCurrency;
    }
  }

  static async claimArchwayReward(
    contractAddress: string,
    campaignId: string,
    claimFee: string
  ) {
    const currentChain = this.getChain();

    await this.checkChain(this.getChain());

    const executeMsg = {
      claim: {
        campaign_id: campaignId,
      },
    };

    return await this.executeContractMsg(
      contractAddress,
      executeMsg,
      currentChain.chainId,
      undefined,
      Number(claimFee) > 0
        ? [
            {
              amount: claimFee,
              denom: currentChain.feeCurrencies[0].coinMinimalDenom,
            },
          ]
        : undefined
    );
  }

  static async mintBadge(mintFee: string) {
    console.log(mintFee)
    const currentChain = this.getChain();
    const contractAddress = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;

    await this.checkChain(this.getChain());

    const executeMsg = {
      mint: {},
    };

    return await this.executeContractMsg(
      contractAddress,
      executeMsg,
      currentChain.chainId,
      undefined,
      Number(mintFee) > 0
        ? [
            {
              amount: mintFee,
              denom: currentChain.feeCurrencies[0].coinMinimalDenom,
            },
          ]
        : undefined
    );
  }

  static async getRewardClaimFee(contractAddress: string) {
    const currentChain = this.getChain();

    await this.checkChain(this.getChain());

    const queryMsg = {
      get_claim_fee: {},
    };
    let result;
    try {
      result = await this.queryContract(
        contractAddress,
        queryMsg,
        currentChain.chainId
      );
    } catch (e) {
      console.error(
        "Failed to get reward claim fee for contract " + contractAddress
      );
      throw e;
    }
    return result;
  }

  static async getMintBadgeFee() {
    const contractAddress = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;
    const currentChain = this.getChain();

    await this.checkChain(this.getChain());

    const queryMsg = {
      mint_badge_fee: {},
    };
    let result;
    try {
      result = await this.queryContract(
        contractAddress,
        queryMsg,
        currentChain.chainId
      );
    } catch (e) {
      console.error(
        "Failed to get reward claim fee for contract " + contractAddress
      );
      throw e;
    }
    return result.mint_badge_fee;
  }

  private static async getSigningClinet(): Promise<SigningArchwayClient> {
    const offlineSigner = await this.getOfflineSigner();

    if (!offlineSigner) {
      throw new Error("Failed to get offline signer");
    }

    const signingArchwayClient = await this.getArchwayClient(offlineSigner);

    if (!signingArchwayClient) {
      throw new Error("Failed to get signing Archway Client");
    }

    return signingArchwayClient;
  }

  private static async getUserAccounts(): Promise<readonly AccountData[]> {
    const offlineSigner = await this.getOfflineSigner();

    if (!offlineSigner) {
      throw new Error("Failed to get offline signer");
    }

    const userAccounts = await this.getAccounts(offlineSigner);

    if (!userAccounts) {
      throw new Error("Failed to get user accounts");
    }

    return userAccounts;
  }

}
