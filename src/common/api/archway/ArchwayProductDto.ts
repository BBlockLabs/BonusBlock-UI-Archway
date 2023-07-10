import type ArchwayMissionDto from "@/common/api/archway/ArchwayMissionDto";

export default class ArchwayProductDto {
  id: string = "";
  title: string = "";
  bannerUrl: string = "";
  description: string = "";
  tags?: string[];
  rewardPoolSize = "";
  socials: Array<{ type: string; link: string; title?: string }> | null = [];
  missions?: Array<ArchwayMissionDto>;
}
