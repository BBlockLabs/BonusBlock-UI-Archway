import type WalletClient from "@/common/WalletClient";
import type { Signature, SignedLoginMessage } from "@/common/WalletClient";
import type { Account } from "@/common/WalletClient";
import {Cosmos, cosmos, InstallError} from "@cosmostation/extension-client";
import { store } from "@/store";
import type CampaignWithRewardDto from "@/common/api/dto/CampaignWithRewardDto";
import { ArchwayClient } from '@archwayhq/arch3.js';
import ArchwayKeplrClient from "@/common/ArchwayKeplrClient";
import {SEND_TRANSACTION_MODE} from "@cosmostation/extension-client/cosmos";

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
    console.log('4');

    if (typeof message !== "string") {
      message = JSON.stringify(message);
    }

    console.log('5');
    return await this.provider.signMessage(chainId, signer, message);
  }

  public async signTransactionLogin(nonce: string, chainId: string): Promise<SignedLoginMessage> {
    console.log('1');

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
    const client = await ArchwayClient.connect(ArchwayKeplrClient.getChain().rpc);

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
    const fee = await this.getClaimFee(contract, chainId);


    console.log('??')
    try {
      await this.provider.sendTransaction(
        chainId,
        "eyJyZXdhcmRfYWxsIjp7InVzZXJfcmV3YXJkcyI6W3siY2FtcGFpZ25faWQiOiIxMTExMTEiLCJ1c2VyX2FkZHJlc3MiOiJhcmNod2F5MTh2MDMya3JydDBzdWQyNXkydms5dmo0OWx2d2tnMmh4bHh1cHdmIiwiYW1vdW50IjoiMTAwMDAifSx7ImNhbXBhaWduX2lkIjoiMjIyMjIyIiwidXNlcl9hZGRyZXNzIjoiYXJjaHdheTE4djAzMmtycnQwc3VkMjV5MnZrOXZqNDlsdndrZzJoeGx4dXB3ZiIsImFtb3VudCI6IjEwMDAwIn1dfX0=", // base64 string or Uint8Array
        SEND_TRANSACTION_MODE.ASYNC
      );
    } catch (e) {
      console.log(e);
    }
    console.log('????')

    // const executeMsg = {
    //   claim: {
    //     campaign_id: campaignId,
    //   },
    // };
    //
    // this.provider.sendTransaction()
    //
    //     return await this.executeContractMsg(
    //   contractAddress,
    //   executeMsg,
    //   currentChain.chainId,
    //   undefined,
    //   Number(claimFee) > 0
    //     ? [
    //         {
    //           amount: claimFee,
    //           denom: currentChain.feeCurrencies[0].coinMinimalDenom,
    //         },
    //       ]
    //     : undefined
    // );

    //   campaign.smartContractAddress
    //
    //
    // await client.claimArchwayReward(campaign.smartContractAddress, campaign.id, fee);

  }
}
