import type { OfflineAminoSigner } from "@keplr-wallet/types";
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

  static async checkChain(chain: any) {
    if (window.keplr) {
      try {
        await window.keplr.enable(chain.chainId);
      } catch (e) {
        await window.keplr.experimentalSuggestChain(this.getChain());
        await window.keplr.enable(chain.chainId);
      }
    } else {
      throw new Error("Keplr is not detected");
    }
  }

  static async chainExists(chainId: string) {
    if (window.keplr) {
      await window.keplr.enable(chainId);
    } else {
      throw new Error("Keplr is not detected");
    }
  }

  static async suggestChain() {
    if (window.keplr) {
      await window.keplr.experimentalSuggestChain(this.getChain());
    } else {
      throw new Error("Keplr is not detected");
    }
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
  static async queryContract(
    contractAddress: string,
    queryMsg: any,
    chainId: string
  ) {
    if (!window.keplr) {
      throw new Error("Keplr is not detected");
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
      throw new Error("Failed to get offline signer");
    }

    const userAccounts = await this.getAccounts(offlineSigner);
    if (!userAccounts) {
      throw new Error("Failed to get user accounts");
    }

    const signingArchwayClient = await this.getArchwayClient(offlineSigner);
    if (!signingArchwayClient) {
      throw new Error("Failed to get signing Archway Client");
    }

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
      throw new Error("Failed to get offline signer");
    }

    const userAccounts = await this.getAccounts(offlineSigner);
    if (!userAccounts) {
      throw new Error("Failed to get user accounts");
    }

    const signingArchwayClient = await this.getArchwayClient(offlineSigner);
    if (!signingArchwayClient) {
      throw new Error("Failed to get signing Archway Client");
    }

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
    return await ArchwayKeplrClient.executeContractMsg(
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

  static async getRewardClaimFee(contractAddress: string) {
    const currentChain = this.getChain();

    await this.checkChain(this.getChain());

    const queryMsg = {
      get_claim_fee: {},
    };
    let result;
    try {
      result = await ArchwayKeplrClient.queryContract(
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
}
