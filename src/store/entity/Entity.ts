import moment, { Moment } from "moment";

export default abstract class Entity {
  createdOn: Moment = moment();
  modifiedOn: Moment = moment();
}
