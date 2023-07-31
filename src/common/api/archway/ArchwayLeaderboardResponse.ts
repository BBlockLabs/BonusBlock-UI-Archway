import type ArchwayLeaderboardRecordDto from "@/common/api/archway/ArchwayLeaderboardRecordDto";
import type MyLeaderBoardSpotDto from "@/common/api/archway/MyLeaderBoardSpotDto";

export default class ArchwayLeaderboardResponse {
  totalRows: number = 0;
  searchResults: Array<ArchwayLeaderboardRecordDto> = [];
  myLeaderboardSpot: MyLeaderBoardSpotDto | null = null;
}
