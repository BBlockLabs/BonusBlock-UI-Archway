import { Window as KeplrWindow } from "@keplr-wallet/types";
import LeapWallet from "@/common/LeapWallet";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {
    opera: string | undefined;
    leap: LeapWallet | undefined;
  }
}
