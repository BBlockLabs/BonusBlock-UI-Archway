import type {Moment} from "moment";
import moment from "moment";

export default class StatisticsActivity {
  campaignActivityId: string = "";
  date: string = "";
  hash: string = "";
  wallet: string = "";
  gas: bigint = 0n;
}
