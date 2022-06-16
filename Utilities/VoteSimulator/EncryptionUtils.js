const crypto = require("crypto");
class EncryptionUtils {

  static signVote(body, privateKey){
    let data = Buffer.from(body);
    let sign = crypto.sign("SHA256", data , privateKey);
    let signature = sign.toString('base64');
    return signature;
  }

  static encryptVote(body, publicKey){
    let data = Buffer.from(body);
    let encrypted = crypto.publicEncrypt(publicKey, data);
    let encryptedVote = encrypted.toString('base64');
    return encryptedVote;
  }

  static unencryptVote(body, privateKey){
    let data = Buffer.from(body, "base64");
    let decrypted = crypto.privateDecrypt(privateKey, data);
    let decryptedVote = decrypted.toString('utf8');
    return decryptedVote;
  }

  static verify(data, signature, publicKey){
    let bytes = Buffer.from(data);
    let sign  = Buffer.from(signature,"base64");
    return crypto.verify("SHA256", bytes, publicKey, sign);
  }
}

module.exports = EncryptionUtils;
