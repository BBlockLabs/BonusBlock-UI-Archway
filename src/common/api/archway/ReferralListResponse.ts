import type ReferralListRowDto from "@/common/api/archway/ReferralListRowDto";

export default class ReferralListResponse {
  totalRows: number = 0;
  searchResults: Array<ReferralListRowDto> = [];
}
