import { credentials, Metadata } from "grpc";
import { promisify } from "util";
import config from "config";
import { TokenClient } from "./proto/token/token_grpc_pb";
import { TokenRequest, TokenResponse } from "./proto/token/token_pb";

/**
 * gRPC GreeterClient Service
 * https://github.com/grpc/grpc-node/issues/54
 */
export class ClientService {
  private readonly client: TokenClient = new TokenClient(`${config.get("AUTH.host")}:${config.get("AUTH.port")}`, credentials.createInsecure());

  public async validate(param: TokenRequest, metadata: Metadata = new Metadata()): Promise<TokenResponse> {
    return promisify<TokenRequest, Metadata, TokenResponse>(this.client.validate.bind(this.client))(param, metadata);
  }
}
