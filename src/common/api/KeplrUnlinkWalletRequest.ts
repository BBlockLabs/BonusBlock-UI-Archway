export default class KeplrUnlinkWalletRequest {
  network: string;
  address: string;

  constructor(network: string, address: string) {
    this.network = network;
    this.address = address;
  }
}
