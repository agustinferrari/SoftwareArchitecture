const axios = require("axios");
const fs = require("fs");
const VoteUtils = require("./VoteUtils");
const MetricsUtils = require("./MetricsUtils");
const MongoAccess = require("../MongoUtilities/mongoAccess");
const ESC = "\x1b"; // ASCII escape character
const CSI = ESC + "["; // control sequence introducer
const EncryptionUtils = require("./EncryptionUtils");

async function test() {
  let serverConfig = JSON.parse(
    fs.readFileSync("../../SRC/VotingSubSystem/config/development.json")
  );
  let appEvPublicKey = serverConfig.publicKey;
  let appEvPrivateKey = serverConfig.privateKey;
  let mongoAccess = new MongoAccess();
  let voters = await mongoAccess.getVoterInformation(1, 1);
  let voter = voters[0];

  let unencryptedVote = {
    voterCI: voter.ci,
    electionId: 1,
    circuitId: 2,
    candidateCI: 3,
    startTimestamp: 0,
  };


  let signed = EncryptionUtils.signVote(
    JSON.stringify(unencryptedVote),
    voter.privateKey
  );

  let encrypted = EncryptionUtils.encryptVote(
    JSON.stringify(unencryptedVote),
    appEvPublicKey
  );
  
  console.log(encrypted);
  let unencrypted = EncryptionUtils.unencryptVote(encrypted, appEvPrivateKey);
  console.log(unencrypted);

  let isVerified = EncryptionUtils.verify(
    JSON.stringify(unencryptedVote),
    signed,
    voter.publicKey
  );

  console.log("isVerified: " + isVerified);
}

test();
