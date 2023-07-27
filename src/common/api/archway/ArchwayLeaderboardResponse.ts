import type ArchwayLeaderboardRecordDto from "@/common/api/archway/ArchwayLeaderboardRecordDto";

export default class ArchwayLeaderboardResponse {
  totalRows: number = 0;
  searchResults: Array<ArchwayLeaderboardRecordDto> = [];
  myLeaderboardSpot: ArchwayLeaderboardRecordDto | null = null;
}
