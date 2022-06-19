import * as grpc from "grpc";
import "dotenv/config";

import { TokenRequest, TokenResponse } from "../proto/token/token_pb";
import { TokenService, ITokenServer } from "../proto/token/token_grpc_pb";
import { getUserInSession } from "../../QueryAPI/Helpers/JwtHelper";
import { UserDTO } from "../../QueryAPI/Models/User";

class TokenHandler implements ITokenServer {
  validate = async (
    call: grpc.ServerUnaryCall<TokenRequest>,
    callback: grpc.sendUnaryData<TokenResponse>
  ): Promise<void> => {
    const reply: TokenResponse = new TokenResponse();
    console.log(`Hello, ${call.request.getToken()}`);

    let result: UserDTO | null = await getUserInSession(call.request.getToken());
    if (result != null) {
      reply.setCi(result.ci);
      reply.setEmail(result.email);
      reply.setRole(result.role);
    }

    callback(null, reply);
  };
}

const port: string | number = process.env.PORT || 50051;

export async function startGRPCServer() {
  const server: grpc.Server = new grpc.Server();

  server.addService(TokenService, new TokenHandler());

  server.bindAsync(
    `0.0.0.0:${port}`,
    grpc.ServerCredentials.createInsecure(),
    (err: Error | null, port: number) => {
      if (err != null) {
        return console.error(err);
      }
      console.log(`gRPC listening on ${port}`);
    }
  );

  server.start();
}
