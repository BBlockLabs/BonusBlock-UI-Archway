export default class ReferralListRequest {
  page: number;
  perPage: number;
  orderBy: "registrationDate" | "missionCount";

  constructor(page: number, perPage: number, orderBy: "registrationDate" | "missionCount") {
    this.page = page;
    this.perPage = perPage;
    this.orderBy = orderBy;
  }
}
