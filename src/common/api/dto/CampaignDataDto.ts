import type { Moment } from "moment";

export default class CampaignDataDto {
  id: string = "";
  name: string = "";
  image: string | null = null;
  imageType: string | null = null;
  networkName: string = "";
  currency: string = "";
  rewardPoolName: string = "";
  periodFrom: Moment | null = null;
  periodTill: Moment | null = null;
  tags: Array<string> = [];
}
