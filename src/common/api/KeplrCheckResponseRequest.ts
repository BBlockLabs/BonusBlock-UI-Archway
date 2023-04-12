export default class KeplrCheckResponseRequest {
  signedObject: string;
  nonce: string;
  referralId: string | null = null;

  constructor(signedObject: string, nonce: string, referralId: string | null) {
    this.signedObject = signedObject;
    this.nonce = nonce;
    this.referralId = referralId;
  }
}
