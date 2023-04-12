import Entity from "@/store/entity/Entity";

export default class User extends Entity {
  userId: string = "";
  invitedCount: number = 0;
}
