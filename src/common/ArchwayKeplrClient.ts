import type { OfflineAminoSigner } from "@keplr-wallet/types";
import { SigningArchwayClient } from "@archwayhq/arch3.js";

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

  static async chainExists(chainId: string) {
    try {
      if (window.keplr) {
        await window.keplr.enable(chainId);
        return true;
      }
    } catch (e) {
      return false;
    }
  }

  static async suggestChain() {
    try {
      if (window.keplr) {
        await window.keplr.experimentalSuggestChain(this.getChain());
        return true;
      }
      return true;
    } catch (e) {
      console.error(e);
      console.log("suggestChain", this.getChain());
      return false;
    }
  }

  static async getAccounts(offlineSigner: OfflineAminoSigner) {
    try {
      const ret = await offlineSigner.getAccounts();
      if (!ret) {
        // @ts-ignore
        console.log("getAccounts", offlineSigner.chainId, offlineSigner, ret);
      }
      return ret;
    } catch (e) {
      console.error(e);
      // @ts-ignore
      console.log("getAccounts", offlineSigner.chainId, offlineSigner);
      return false;
    }
  }

  static async getOfflineSigner() {
    // @ts-ignore
    const ret = window.getOfflineSignerOnlyAmino(
      ArchwayKeplrClient.getChain().chainId
    );
    if (!ret) {
      console.log(
        "getOfflineSigner",
        ArchwayKeplrClient.getChain().chainId,
        ret
      );
    }
    return ret;
  }
  static async executeContractMsg(
    contractAddress: string,
    executeMsg: any,
    chainId: string,
    memo?: string
  ) {
    if (!window.keplr) {
      return false;
    }
    window.keplr.defaultOptions = {
      sign: {
        preferNoSetFee: true,
        preferNoSetMemo: true,
      },
    };

    await window.keplr.enable(chainId);

    const offlineSigner = await this.getOfflineSigner();
    if (!offlineSigner) {
      return false;
    }

    const userAccounts = await this.getAccounts(offlineSigner);
    if (!userAccounts) {
      return false;
    }

    const signingArchwayClient = await this.getArchwayClient(offlineSigner);
    if (!signingArchwayClient) {
      return false;
    }

    try {
      await signingArchwayClient.execute(
        userAccounts[0].address,
        contractAddress,
        executeMsg,
        "auto",
        memo
      );
    } catch (e) {
      console.error(e);
      return false;
    }
    return true;
  }

  static async getArchwayClient(offlineSigner: OfflineAminoSigner) {
    return await SigningArchwayClient.connectWithSigner(
      this.getChain().rpc,
      offlineSigner
    );
  }

  static getChain() {
    const currentEnv = import.meta.env.VITE_ENV;
    if (currentEnv === "dev") {
      return this.testnetChainInfo;
    } else {
      return this.mainnetChainInfo;
    }
  }

  static getCurrency() {
    const currentEnv = import.meta.env.VITE_ENV;
    if (currentEnv === "dev") {
      return this.testnetCurrency;
    } else {
      return this.mainnetCurrency;
    }
  }

  static async claimArchwayReward(campaignId: string) {
    const currentChain = this.getChain();
    if (!(await this.chainExists(currentChain.chainId))) {
      await this.suggestChain();
    }

    const executeMsg = {
      claim: {
        campaign_id: campaignId,
      },
    };

    const contractAddress = import.meta.env.VITE_ARCHWAY_REWARD_POOL_CONTRACT;
    return await ArchwayKeplrClient.executeContractMsg(
      contractAddress,
      executeMsg,
      currentChain.chainId
    );
  }
}
