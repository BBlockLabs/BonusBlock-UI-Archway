export default class CampaignWithRewardDto {
  id: string = "";
  name: string = "";
  networkName: string = "";
  smartContractAddress: string = "";
  amount: string = "";
  decimal: number = NaN;
  currency: string = "";
  periodFrom: any;
  periodTill: any;
  periodFromParsed: number = NaN;
  periodTillParsed: number = NaN;
  socials: Array<{ type: string; link: string; title: string }> | null = [];
  mainLink: string = "";
  mainLinkTitle: string = "";
}
