let apiPort = 3008;
let apiHost = "localhost";
let endpoint = "/votes";

const crypto = require("crypto");
const { algo } = require("crypto-js");
const {CryptoKey} = require("crypto")
let request = "http://" + apiHost + ":" + apiPort + endpoint;

let serverKeys = {
  publicKey:
    "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwwPCirj8OqDmeDUKeun4\n7OSLu8bjGj7EE5FF1yZLco3WAwHlateU0B3GJv1brlENeLyJFrVNZxjb2qZ7mzLz\nJoTACXZHmFxIBqpaU7Og2XZFe6vXjsQCZSZTwUtNJROD981OPdqUoo2OaH+nn1Ii\nJtitscf+1Brx6cYo0OfJjFyWIapXlFUbxfUdLYYnQeDntWSNbFaQRqj+aKRprKww\n/FpUwE7Iow159ExJL9IHvczejLGG3mxQEINzl8y9n/Vn6UEkxWajK0CEeqr+EiHM\nSQ6P9/w8lrY3pkv7/4NB0oTJjM+zLT6qg8oIGqqrjtEAuWgkzuM0yha7v+hbxp9A\nvwIDAQAB\n-----END PUBLIC KEY-----\n",
  privateKey:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDDA8KKuPw6oOZ4\nNQp66fjs5Iu7xuMaPsQTkUXXJktyjdYDAeVq15TQHcYm/VuuUQ14vIkWtU1nGNva\npnubMvMmhMAJdkeYXEgGqlpTs6DZdkV7q9eOxAJlJlPBS00lE4P3zU492pSijY5o\nf6efUiIm2K2xx/7UGvHpxijQ58mMXJYhqleUVRvF9R0thidB4Oe1ZI1sVpBGqP5o\npGmsrDD8WlTATsijDXn0TEkv0ge9zN6MsYbebFAQg3OXzL2f9WfpQSTFZqMrQIR6\nqv4SIcxJDo/3/DyWtjemS/v/g0HShMmMz7MtPqqDyggaqquO0QC5aCTO4zTKFru/\n6FvGn0C/AgMBAAECggEAM88U6QvaHq1ObVMSFLOCKVVSdjGRdhCEwPoQRudqleVu\nnN/tFiRt6ZhvYz5eFAJ+hLv546mJBcHJ7t3Z6tJvXKVZ62mb/bNOg07QrnoDWqKc\nNQ3jN4+FX1/+UlTyCs6Tecr2ZWJjqIfY9JQtcRs97XoVMy0B21HJQSUfBNj/Z6Ve\nf2CTd+Lw5X0QSdqoH0BOP0BAXzG5c1VqNiGXiYnmfugghnPjADK7UjteCuR6yWDf\nrMb5AR2YY0HtGfDZAG+7a4vDOo8tlcDE25jRHnpPGK3gG12ryjy2T125CmXiWDVq\n+3hEbDpnjy3WaPgJAhy63y93N/oskZMKBBioaoocwQKBgQDowerYznVHgNJB3LjJ\nXp0mk8exrMwJMH5Wjg73qDKuzdmNnEL2/SWoWBXz0xe2B6axowTeVwyqY6QZ7coU\ncquw6jJ/4ecUSPkWAt3FnLp5XQe+SEtMnA94tq5aXIgX+Gf7oT6jR+hQlpIBqBTN\nO/ng1NbHILHMf/3VzM7mQikwnwKBgQDWfQGxI8sWAJ6AHKo54W9mvdueKf3wgjz7\nlNV/f5+auXDGOH4SbgWk7WEZ+LkAJ3VHVv/ACcTQQiLgoMrJ+dSEPHwv9oDz7SO8\nzVIzqTZAGhPzy2VByjYNJFdqu4lsExOn9TGUg0S9Yt6Eaf37st8q5Gaw3Y+4qWF3\nHSBcsf1b4QKBgAeC8pRKnWhQVPjBKcl93y52iHRIclE9mmYqsXr2l6QiionSaCrW\nYpe7OAIlZtd+Cbgj3a1bO9Jn4szfaq0cQkQ0Wqrb3HxAGqHGN+f/tdji0rQmWx++\nzZUEuD28TLwRTTHGs2HLmUi4gz/Ab+NrsxW5aLEGchZ6bvOuZ2Lw8albAoGABdrh\nufEtMQuRSBQAPZY+0UIrhZTF3tPfUErOzS0xsSqQvoh6QIyKUOc9+FSG0E9Db1Ab\nqSVbHwg/JXyeLIdKWtW/2htTh9UYXaYJMWnUFknf847A09vuP8uXK021QaL/rV0P\nHmu666SQSHMQQNewKd6UQw25R6QwCe1cncsqDGECgYEAz3hvZ4/y+/kDH6dE06UB\neY3n3eT25CDtPfFXABN6M1CDhVS+YyFwC58EiC+5Aq18e3eseZ8cvBgJ4xM1OIYm\nYjpJcRv0YqtJYJXReeB7UAy5b/aAbHN9/ntIWAFtuefIk2NkBZ2xAIBdyJRqhTRD\n+5ZMB/XYOEXqPJxI7Bgjxqs=\n-----END PRIVATE KEY-----\n",
};

const fs = require("fs");
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

let message = "HOLA";
console.log("Message: ", message);

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

// Computing secret

let voterKeys = {
  publicKey: voterDiffie.getPublicKey("base64"),
  privateKey: voterDiffie.getPrivateKey("base64"),
};


let loadedVoterDiffie = recreateDiffieHellman(voter);

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
  let cryptoKey = new CryptoKey();
  cryptoKey.privateKey = keys.privateKey;
  cryptoKey.publicKey = keys.publicKey;

  let privateKey = crypto.KeyObject.from(
    cryptoKey
  );
  console.log("PrivateKey recreated: ", privateKey)

  let publicKey = crypto.createPublicKey(
    Buffer.from(keys.publicKey,"utf8")
  );

  console.log("PublicKey recreated: ", publicKey)
  let resultingDiffie = crypto.diffieHellman({ privateKey, publicKey });
  return resultingDiffie;
}
