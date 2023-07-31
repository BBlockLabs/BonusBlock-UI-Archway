import type WalletClient from "@/common/WalletClient";
import type { Signature, SignedLoginMessage } from "@/common/WalletClient";
import type { Account } from "@/common/WalletClient";
import {Cosmos, cosmos, InstallError} from "@cosmostation/extension-client";

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
}
