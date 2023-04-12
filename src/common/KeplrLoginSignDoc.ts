import type {
  Coin,
  StdFee,
  Msg,
  StdSignDoc,
  KeplrSignOptions,
} from "@keplr-wallet/types";

export class LoginSignOptions implements KeplrSignOptions {
  readonly preferNoSetFee: boolean = true;
  readonly preferNoSetMemo: boolean = true;
}

export class KeplrLoginMsgValue {
  readonly permit_name: string;
  readonly permissions: Array<void> = [];

  constructor(permitName: string) {
    this.permit_name = permitName;
  }
}

export class KeplrLoginMsg implements Msg {
  readonly type: string = "query_permit";
  readonly value: any;

  constructor(permitName: string) {
    this.value = new KeplrLoginMsgValue(permitName);
  }
}

export class KeplrLoginCoin implements Coin {
  readonly amount: string = "0";
  readonly denom: string;

  constructor(denom: string) {
    this.denom = denom;
  }
}

export class KeplrLoginFee implements StdFee {
  readonly amount: readonly Coin[];
  readonly gas: string = "1";

  constructor(denom: string) {
    this.amount = [new KeplrLoginCoin(denom)];
  }
}

export default class KeplrLoginSignDoc implements StdSignDoc {
  readonly account_number: string = "0";
  readonly chain_id: string;
  readonly fee: StdFee;
  readonly memo: string = "";
  readonly msgs: readonly Msg[];
  readonly sequence: string = "0";

  constructor(chainId: string, denom: string, permitName: string) {
    this.chain_id = chainId;
    this.fee = new KeplrLoginFee(denom);
    this.msgs = [new KeplrLoginMsg(permitName)];
  }
}
