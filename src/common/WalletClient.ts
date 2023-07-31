import type CampaignWithRewardDto from "@/common/api/dto/CampaignWithRewardDto";

export interface Account {
  address: string;
}

export interface Signature {
  pub_key: {
    type: string,
    value: string,
  },
  signature: string,
}

export interface SignedLoginMessage {
  signed: {
    account_number: string,
    chain_id: string,
    fee: {
      amount: Array<{
        amount: string,
        denom: string,
      }>,
      gas: string
    },
    memo: string,
    sequence: string,
    msgs: Array<{
      type: string,
      value: any
    }>
  }
  signature: Signature,
}

export default interface WalletClient {
  getAccountAddress(chainId: string): Promise<Account[]>;
  signMessage(message: any, chainId: string, signer: string | null): Promise<Signature>;
  signTransactionLogin(nonce: string, chainId: string): Promise<SignedLoginMessage>;
  claimReward(contract: string, campaignId: string, chainId: string): Promise<any>;
}
