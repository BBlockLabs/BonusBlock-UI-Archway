export default class MetamaskConnectRequest {
  blockchainName: string;
  signedMessage: string;
  nonce: string;
  referralId: string | null;

  constructor(
    blockchainName: string,
    signedMessage: string,
    nonce: string,
    referralId: string | null
  ) {
    this.blockchainName = blockchainName;
    this.signedMessage = signedMessage;
    this.nonce = nonce;
    this.referralId = referralId;
  }
}
