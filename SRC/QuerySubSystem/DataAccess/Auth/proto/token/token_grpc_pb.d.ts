// package: token
// file: token.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as token_pb from "./token_pb";

interface ITokenService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    validate: ITokenService_IValidate;
}

interface ITokenService_IValidate extends grpc.MethodDefinition<token_pb.TokenRequest, token_pb.TokenResponse> {
    path: string; // "/token.Token/Validate"
    requestStream: boolean; // false
    responseStream: boolean; // false
    requestSerialize: grpc.serialize<token_pb.TokenRequest>;
    requestDeserialize: grpc.deserialize<token_pb.TokenRequest>;
    responseSerialize: grpc.serialize<token_pb.TokenResponse>;
    responseDeserialize: grpc.deserialize<token_pb.TokenResponse>;
}

export const TokenService: ITokenService;

export interface ITokenServer {
    validate: grpc.handleUnaryCall<token_pb.TokenRequest, token_pb.TokenResponse>;
}

export interface ITokenClient {
    validate(request: token_pb.TokenRequest, callback: (error: grpc.ServiceError | null, response: token_pb.TokenResponse) => void): grpc.ClientUnaryCall;
    validate(request: token_pb.TokenRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: token_pb.TokenResponse) => void): grpc.ClientUnaryCall;
    validate(request: token_pb.TokenRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: token_pb.TokenResponse) => void): grpc.ClientUnaryCall;
}

export class TokenClient extends grpc.Client implements ITokenClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public validate(request: token_pb.TokenRequest, callback: (error: grpc.ServiceError | null, response: token_pb.TokenResponse) => void): grpc.ClientUnaryCall;
    public validate(request: token_pb.TokenRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: token_pb.TokenResponse) => void): grpc.ClientUnaryCall;
    public validate(request: token_pb.TokenRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: token_pb.TokenResponse) => void): grpc.ClientUnaryCall;
}
