import type { Moment } from "moment/moment";
import moment from "moment/moment";

export default class CalculationResultDto {
  periodFrom: Moment = moment();
  periodTill: Moment = moment();
  preview: boolean = true;
  staking: number = 0;
  frequency: number = 0;
  activity: number = 0;
  rewardPoints: number = 0;
  reward: number = 0;
  network: string = "";
}
