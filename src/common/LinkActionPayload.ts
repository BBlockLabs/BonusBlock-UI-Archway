import type Chain from "@/common/Chain";

export default class LinkActionPayload {
  chain: Chain;
  referral: string | null = null;

  constructor(chain: Chain, referral: string | null = null) {
    this.chain = chain;
    this.referral = referral;
  }
}
