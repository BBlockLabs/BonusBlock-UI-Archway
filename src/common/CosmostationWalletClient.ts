import type WalletClient from "@/common/WalletClient";
import type { Signature, SignedLoginMessage } from "@/common/WalletClient";
import type { Account } from "@/common/WalletClient";
import {Cosmos, cosmos, InstallError} from "@cosmostation/extension-client";
import { store } from "@/store";
import type CampaignWithRewardDto from "@/common/api/dto/CampaignWithRewardDto";
import { ArchwayClient } from '@archwayhq/arch3.js';
import ArchwayKeplrClient from "@/common/ArchwayKeplrClient";
import {SEND_TRANSACTION_MODE} from "@cosmostation/extension-client/cosmos";
// import {getOfflineSigner} from "@cosmostation/cosmos-client";
import { GasPrice, calculateFee } from "@cosmjs/stargate";
import { SigningArchwayClient } from "@archwayhq/arch3.js";
import { Decimal } from "@cosmjs/math";

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

  private async getClaimFee(contract: string, chainId: string): Promise<string> {
    const client = await ArchwayClient.connect(this.getChainRpc(chainId));

    return await client.queryContractSmart(contract,  {get_claim_fee: {}});
  }

  public getRewardClaimFee(): null {
    // This is just here for coolect reward function, it doesn't use the fees anyway
    return null;
  }

  claimArchwayReward(contract: string, campaignId: string, claimFee: string): Promise<any> {
    return this.claimReward(contract, campaignId, ArchwayKeplrClient.getChain().chainId);
  }

  async claimReward(contract: string, campaignId: string, chainId: string): Promise<any> {
    const fee: string = await this.getClaimFee(contract, chainId);

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
      Number(fee) > 0
        ? [
        {
          amount: fee,
          denom: this.getChainDenom(chainId),
        }
          ]
        : undefined
    );
  }

  private getChainRpc(chainId: string): string {
    return ArchwayKeplrClient.getChain().rpc
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
