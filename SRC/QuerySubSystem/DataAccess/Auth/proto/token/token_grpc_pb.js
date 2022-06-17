// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var token_pb = require('./token_pb.js');

function serialize_token_TokenRequest(arg) {
  if (!(arg instanceof token_pb.TokenRequest)) {
    throw new Error('Expected argument of type token.TokenRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_token_TokenRequest(buffer_arg) {
  return token_pb.TokenRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_token_TokenResponse(arg) {
  if (!(arg instanceof token_pb.TokenResponse)) {
    throw new Error('Expected argument of type token.TokenResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_token_TokenResponse(buffer_arg) {
  return token_pb.TokenResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var TokenService = exports.TokenService = {
  validate: {
    path: '/token.Token/Validate',
    requestStream: false,
    responseStream: false,
    requestType: token_pb.TokenRequest,
    responseType: token_pb.TokenResponse,
    requestSerialize: serialize_token_TokenRequest,
    requestDeserialize: deserialize_token_TokenRequest,
    responseSerialize: serialize_token_TokenResponse,
    responseDeserialize: deserialize_token_TokenResponse,
  },
};

exports.TokenClient = grpc.makeGenericClientConstructor(TokenService);
