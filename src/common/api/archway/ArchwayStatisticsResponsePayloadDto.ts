import type StatisticsActivity from "@/common/api/archway/StatisticsActivity";
import type StatisticsRecord from "@/common/api/archway/StatisticsRecord";
import type ArchwayMissionDto from "@/common/api/archway/ArchwayMissionDto";
import type MissionDto from "@/common/api/dto/MissionDto";
import type ProductDto from "@/common/api/dto/ProductDto";

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
  actions: Array<StatisticsRecord>;
  missions: Array<MissionDto>;
  products: Array<ProductDto>;
}
