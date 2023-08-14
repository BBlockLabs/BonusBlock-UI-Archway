import type WalletClient from "@/common/WalletClient";
import type { Signature, SignedLoginMessage } from "@/common/WalletClient";
import type { Account } from "@/common/WalletClient";
import { Cosmos, cosmos, InstallError } from "@cosmostation/extension-client";
import { ArchwayClient } from "@archwayhq/arch3.js";
import ArchwayKeplrClient from "@/common/ArchwayKeplrClient";
import { SigningArchwayClient } from "@archwayhq/arch3.js";

export default class CosmostationWalletClient implements WalletClient {
  private provider: Cosmos;

  constructor(provider: Cosmos) {
    this.provider = provider;
  }

  public static async create(): Promise<CosmostationWalletClient> {
    try {
      return new CosmostationWalletClient(await cosmos())
    } catch (e) {
      console.log(e);

      if (e instanceof InstallError) {
        throw("Please install cosmostation extension");
      }

      throw(e);
    }
  }

  public async getAccountAddress(chainId: string): Promise<[Account]> {
    let account;

    try {
      try {
        account = await this.provider.getAccount(chainId);
      } catch (e: any) {
        if (e.code === 4100) {
          account = await this.provider.requestAccount(chainId);
        }
      }
    } catch (e: any) {
      if (e.code === 4001) {
        console.log("user rejected request");
      }
    }

    return [account as Account];
  }

  public async signMessage(message: any, chainId: string, signer: string | null = null): Promise<Signature> {
    if (signer === null) {
      signer = (await this.getAccountAddress(chainId))[0].address;
    }

    if (typeof message !== "string") {
      message = JSON.stringify(message);
    }

    return await this.provider.signMessage(chainId, signer, message);
  }

  public async signTransactionLogin(nonce: string, chainId: string): Promise<SignedLoginMessage> {
    await this.addChain();

    const response = await this.provider.signAmino(
      chainId,
      {
        account_number: "0",
        chain_id: chainId,
        fee: {amount: [], gas: "0"},
        memo: "",
        sequence: "0",
        msgs: [{
          type: "query_permit",
          value: {
            permissions: [],
            permit_name: nonce,
          }
        }]
      }
    );

    return {
      signed: response.signed_doc,
      signature: {
        signature: response.signature,
        pub_key: response.pub_key,
      }
    };
  }

  async getMintBadgeFee(): Promise<string> {
    const contractAddress = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;
    const client = await ArchwayClient.connect(
      ArchwayKeplrClient.getChain().rpc
    );

    const ret = await client.queryContractSmart(contractAddress, {
      mint_badge_fee: {},
    });

    return ret.mint_badge_fee;
  }

  async getRewardClaimFee(contractAddress: string): Promise<string> {
    const client = await ArchwayClient.connect(
      ArchwayKeplrClient.getChain().rpc
    );

    return await client.queryContractSmart(contractAddress, {
      get_claim_fee: {},
    });
  }

  async claimArchwayReward(contract: string, campaignId: string, claimFee: string): Promise<any> {
    const chainId = ArchwayKeplrClient.getChain().chainId;

    const client = await SigningArchwayClient.connectWithSigner(
      this.getChainRpc(chainId),
      await ArchwayKeplrClient.getOfflineSigner()
    );

    const result = await client.execute(
      (await this.getAccountAddress(chainId))[0].address,
      contract,
      {
        claim: {
          campaign_id: campaignId,
        },
      },
      "auto",
      undefined,
      Number(claimFee) > 0
        ? [
        {
          amount: claimFee,
          denom: this.getChainDenom(chainId),
        }
          ]
        : undefined
    );
  }

  async mintBadge(mintFee: string){
    const currentChain = ArchwayKeplrClient.getChain();
    const contractAddress = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;

    const client = await SigningArchwayClient.connectWithSigner(
      currentChain.rpc,
      await ArchwayKeplrClient.getOfflineSigner()
    );

    const result = await client.execute(
      (await this.getAccountAddress(currentChain.chainId))[0].address,
      contractAddress,
      {
        mint: {},
      },
      "auto",
      undefined,
      Number(mintFee) > 0
        ? [
          {
            amount: mintFee,
            denom: this.getChainDenom(currentChain.chainId),
          }
        ]
        : undefined
    );
  }

  private getChainRpc(chainId: string): string {
    return ArchwayKeplrClient.getChain().rpc;
  }

  private getChainDenom(chainId: string): string {
    return ArchwayKeplrClient.getChain().feeCurrencies[0].coinMinimalDenom;
  }

  private async addChain(): Promise<void> {
    const chain = ArchwayKeplrClient.getChain();

    await this.provider.addChain({
      chainId: chain.chainId,
      chainName: chain.chainName || chain.chainId,
      addressPrefix: chain.bech32Config.bech32PrefixAccAddr,
      baseDenom: chain.currencies[0].coinMinimalDenom,
      displayDenom: chain.currencies[0].coinDenom,
      restURL: chain.rest,
      coinType: String(chain.coinType),
      decimals: chain.currencies[0].coinDecimals
    });
  }
}
