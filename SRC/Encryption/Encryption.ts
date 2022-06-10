import { IEncryption } from "./IEncryption";
var crypto = require("crypto");

export class Encryption implements IEncryption {
  publicEncrypt(key: string, data: string): string {
    return crypto.publicEncrypt(
      key,
      Buffer.from(data)
    );
  }
  privateDecrypt(key: string, data: string): string {
    return crypto.privateDecrypt(
      {
        key: key,
      },
      Buffer.from(data, "base64")
    );
  }
  privateEncrypt(key: string, data: string): string {
    return crypto.privateEncrypt(
      key,
      Buffer.from(data)
    );
  }
  publicDecrypt(key: string, data: string): string {
    return crypto.publicDecrypt(
      {
        key: key,
      },
      Buffer.from(data, "base64")
    );
  }
}