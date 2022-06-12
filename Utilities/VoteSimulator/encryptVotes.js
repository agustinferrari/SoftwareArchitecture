let apiPort = 3008;
let apiHost = "localhost";
let endpoint = "/votes";

const crypto = require("crypto");
const { algo } = require("crypto-js");
let request = "http://" + apiHost + ":" + apiPort + endpoint;
const fs = require("fs");
let serverConfig = JSON.parse(
  fs.readFileSync("../../SRC/VotingSubSystem/config/development.json")
);

let serverKeys = {
  publicKey: serverConfig.publicKey,
  privateKey: serverConfig.privateKey,
};

let voters = JSON.parse(
  fs.readFileSync("./VoterVotingInformation.json")
).voters;

let voter = voters[0];

let electionId = voter.electionId;
let circuitId = voter.circuitId;
let candidateCI = "26974693";

let vote = {
  electionId,
  circuitId,
  candidateCI,
};
let stringifiedVote = JSON.stringify(vote);
// console.log(stringifiedVote);
// // let vote = "ci";

// let voterEncryptedVote = crypto
//   .privateEncrypt(voter.privateKey, Buffer.from(stringifiedVote, "utf8"))
//   .toString();
// console.log("Public");

// console.log(voterEncryptedVote);
// let serverEncryptedVote = crypto
//   .publicEncrypt(
//     serverKeys.publicKey,
//     Buffer.from(voterEncryptedVote, "base64")
//   )
//   .toString("base64");

// fs.writeFileSync(
//   "./voteExamples.txt",
//   JSON.stringify({ voterCI: voter.ci, data: serverEncryptedVote })
// );

// let decryptedVote = crypto.privateDecrypt( serverKeys.privateKey, Buffer.from(serverEncryptedVote, "base64"));
// console.log()
// console.log()
// console.log()

// console.log(decryptedVote)
// console.log("Server Decrypted")
// console.log()
// console.log()
// console.log()

// let finalObj = crypto.publicDecrypt(voter.publicKey, Buffer.from(decryptedVote,"utf")).toString();
// console.log("Result: ", finalObj)

// let message = "HOLA";
// console.log("Message: ", message);

// let a =crypto.privateEncrypt(voter.privateKey, Buffer.from(message, "utf8")).toString();
// console.log("A: ", a)
// let b = crypto.publicEncrypt(serverKeys.privateKey, Buffer.from(a,"utf8")).toString("base64");
// console.log("B: ", b)
// let c = crypto.privateDecrypt(serverKeys.privateKey, Buffer.from(b, "base64")).toString();
// console.log("C: ", c)
// let d = crypto.publicDecrypt(voter.publicKey, c).toString();
// console.log("D: ", d)

// Calling two getDiffieHellman method
// with its parameter, groupName

const voterDiffie = crypto.getDiffieHellman("modp14");
const serverDiffie = crypto.getDiffieHellman("modp14");

// Generating keys
voterDiffie.generateKeys();
serverDiffie.generateKeys();

let voterKeys = {
  publicKey: voterDiffie.getPublicKey("base64"),
  privateKey: voterDiffie.getPrivateKey("base64"),
};

let loadedVoterDiffie = recreateDiffieHellman(serverKeys);

let savedServerPublic = serverDiffie.getPublicKey().toString("base64");
let savedVoterPublic = loadedVoterDiffie.getPublicKey().toString("base64");

const diffiehellmangrp1sc = loadedVoterDiffie.computeSecret(
  Buffer.from(savedServerPublic, "base64"),
  null,
  "base64"
);

const diffiehellmangrp2sc = serverDiffie.computeSecret(
  Buffer.from(savedVoterPublic, "base64"),
  null,
  "base64"
);

// Checking if both the secrets are same or not
console.log(diffiehellmangrp1sc === diffiehellmangrp2sc);

function recreateDiffieHellman(keys) {
  console.log(keys);
  let privateKey = crypto.createPrivateKey(keys.publicKey);
  console.log("PrivateKey recreated: ", privateKey);

  let publicKey = crypto.createPublicKey(Buffer.from(keys.publicKey, "utf8"));

  console.log("PublicKey recreated: ", publicKey);
  let resultingDiffie = crypto.diffieHellman({ privateKey, publicKey });
  return resultingDiffie;
}

class VoteEncryptor{
    
}
module.exports = VoteEncryptor;