import type { Moment } from "moment/moment";
import moment from "moment";

export default class ReferralListRowDto {
  username: string = "";
  missionCount: number = 0;
  registrationDate: Moment = moment();
}
