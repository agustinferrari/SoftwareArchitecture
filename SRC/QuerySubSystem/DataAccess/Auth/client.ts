import "source-map-support/register";
import { Client, credentials, Metadata, ServiceError } from "grpc";
import { TokenClient } from "./proto/token/token_grpc_pb";
import { TokenRequest, TokenResponse } from "./proto/token/token_pb";
import { ClientService } from "./clientService";
import { IUser, UserDTO } from "../../QueryAPI/Models/User";

const clientService: ClientService = new ClientService();

console.log("gRPC:GreeterClient", new Date().toLocaleString());

export async function validateToken(token: string): Promise<UserDTO> {
  const param: TokenRequest = new TokenRequest();
  param.setToken(token);
  const tokenResponse = await clientService.validate(param);

  if (tokenResponse.getCi()) {
    let user: UserDTO = new UserDTO(
      tokenResponse.getEmail(),
      tokenResponse.getCi(),
      tokenResponse.getRole()
    );
    return user;
  }

  throw new Error("Token is not valid");
}
