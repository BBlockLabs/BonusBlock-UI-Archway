import type StatisticsActivity from "@/common/api/archway/StatisticsActivity";

export interface CampaignActivities {
  id: string;
  address: string,
  action: string,
  network: {
    id: string;
    name: string;
    denom: string;
    decimal: number;
    network: string;
  },
  campaign: {
    id: string;
    title: string;
    periodFrom: string;
    periodTill: string;
    rateDaily: number;
    rateWeekly: number;
    rateMonthly: number;
    maxUserReward: string;
    minUserReward: string;
    rewardPoolAmount: string;
    expectedROI: number;
    weeklyEqDistribution: boolean;
    qualityAudience: boolean;
    status: string;
    rewardPool: { id: string, smartContractAddress: string, networkName: string}
    network: {
      id: string;
      name: string;
      denom: string;
      decimal: number;
      network: string;
    };
    weightBondedTokens: string;
    weightFrequency: string;
    weightActivity: string;
  };
  product: {
    id: "string";
    name: "string";
  };
}

export interface ArchwayStatisticsResponsePayloadDto {
  activity: Array<StatisticsActivity>;
  campaignActivities: Array<CampaignActivities>;
}
