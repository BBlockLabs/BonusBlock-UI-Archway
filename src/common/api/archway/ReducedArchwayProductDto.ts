import type ReducedArchwayMissionDto from "./ReducedArchwayMissionDto";
export default class ReducedArchwayProductDto {
  id: string = "";
  title: string = "";
  icon: string = "";
  tags?: string[];
  rewardPoolSize = "";
  shortDescription: string = "";
  featuredMission?: ReducedArchwayMissionDto;
  createdOn: string = "";
}
