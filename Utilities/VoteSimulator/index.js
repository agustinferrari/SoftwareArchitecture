const fs = require("fs");
let serverConfig = JSON.parse(
  fs.readFileSync("../../SRC/VotingSubSystem/config/development.json")
);

let apiHost = "localhost";
let endpoint = "/votes";
let apiPort = serverConfig.VOTING_API.port;

let url = "http://" + apiHost + ":" + apiPort;
console.log("Starting vote simulator to url: " + url);

let voters = JSON.parse(
  fs.readFileSync("./VoterVotingInformation.json")
).voters;
var elections = JSON.parse(
  fs.readFileSync("../APIAutoridadElectoral/SimulatedElectoralAPI.json")
).elections;

var currentVoter = 0;

function setupVote(client) {
  let voter = voters[currentVoter];
  ++currentVoter;
  let electionId = voter.electionId;
  let circuitId = voter.circuitId;

  let election;
  let found = false;
  for (let i = 0; i < elections.length && !found; ++i) {
    if (elections[i].id === electionId) {
      election = elections[i];
      found = true;
    }
  }
  let candidates = election.candidates;
  let pos = getRandomInt(0, candidates.length - 1);
  let candidate = candidates[pos];
  let candidateCI = candidate.ci;

  // let vote = {
  //   electionId,
  //   circuitId,
  //   candidateCI,
  // };

  // let stringifiedVote = JSON.stringify(vote);
  //  let encrypted =  voteEncryptor(stringifiedVote);

  let unencryptedVote = {
    voterCI: voter.ci,
    electionId,
    circuitId,
    candidateCI,
  };

  client.setHeadersAndBody(
    {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    JSON.stringify(unencryptedVote)
  );
}

// makeRequests(300000);
const autocannon = require("autocannon");

autocannon(
  {
    url: url + endpoint,
    method:"POST",
    amount: 30000,
    duration: 10,
    setupClient: setupVote,
  },
  console.log
);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
