export default class CampaignWithRewardDto {
  id: string = "";
  name: string = "";
  networkName: string = "";
  amount: string = "";
  decimal: number = NaN;
  currency: string = "";
  periodFrom: any;
  periodTill: any;
  periodFromParsed: number = NaN;
  periodTillParsed: number = NaN;
}
