import ArchwayLeaderboardRecordDto from "@/common/api/archway/ArchwayLeaderboardRecordDto";

export default class MyLeaderBoardSpotDto {
  position: ArchwayLeaderboardRecordDto = new ArchwayLeaderboardRecordDto();
  badgeClaimed: boolean = false;
  newBadgePopup: boolean = false;
}
