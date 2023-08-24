import type WalletDto from "@/common/api/dto/WalletDto";

export default class UserDto {
  userId: string = "";
  createdOn: string = "";
  modifiedOn: string = "";
  twitter: string = "";
  discord: string = "";
  invitedCount: number = 0;
  wallets: Array<WalletDto> = [];
}
