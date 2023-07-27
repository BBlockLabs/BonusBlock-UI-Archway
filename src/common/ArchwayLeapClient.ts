import ArchwayKeplrClient from "@/common/ArchwayKeplrClient";
import type {Keplr} from "@keplr-wallet/types";

export class ArchwayLeapClient extends ArchwayKeplrClient {
  public static get client(): Keplr {
    if (!window.leap) {
      throw new Error("Leap is not detected");
    }

    return window.leap;
  }
}
