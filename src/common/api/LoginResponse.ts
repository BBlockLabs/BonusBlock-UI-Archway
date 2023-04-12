import UserDto from "@/common/api/dto/UserDto";
import SessionDto from "@/common/api/dto/SessionDto";

export default class LoginResponse {
  session: SessionDto = new SessionDto();
  account: UserDto = new UserDto();
}
