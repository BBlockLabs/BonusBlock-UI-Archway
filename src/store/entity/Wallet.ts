import Entity from "@/store/entity/Entity";
import type User from "@/store/entity/User";

export default class Wallet extends Entity {
  address: string = "";
  network: string = "";
  user: User | null = null;
}
