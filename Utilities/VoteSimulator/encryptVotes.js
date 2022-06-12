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
