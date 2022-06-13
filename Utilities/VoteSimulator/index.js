const fs = require("fs");
let serverConfig = JSON.parse(
  fs.readFileSync("../../SRC/VotingSubSystem/config/development.json")
);

let apiHost = "localhost";
let endpoint = "/votes";
let apiPort = serverConfig.VOTING_API.port;

let url = "http://" + apiHost + ":" + apiPort;
console.log("Starting vote simulator to url: " + url);

let jsonVoters = JSON.parse(
  fs.readFileSync("./VoterVotingInformation.json")
).voters;
var elections = JSON.parse(
  fs.readFileSync("../APIAutoridadElectoral/SimulatedElectoralAPI.json")
).elections;

let electionUniqueMode = [];

elections.forEach((element) => {
  if (element.mode == "unique") {
    electionUniqueMode.push(element.id);
  }
});

let voters = [];

// jsonVoters.forEach((element) => {
//   if (electionUniqueMode.includes(element.electionId)) {
//     voters.push(element);
//   }
// });

// let firstVoter = voters[0];
// voters = [];
// voters.push(jsonVoters[0]);
// jsonVoters.forEach(v=>{
//   voters.push(v);
// })

for (let i =0; i< jsonVoters.length; i++){
  let numberToVote = 3;
  let randomNumber = getRandomInt(1,3);
  if(numberToVote == randomNumber){
    voters.push(jsonVoters[i]);
  }
}

// voters = jsonVoters;

var currentVoter = 0;

let previousVoterElection = [];

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

  // let candidateCI = "66330300";

  let startDate = formatDate(election.startDate);
  let endDate = formatDate(election.endDate);

  //Add one day to startDate
  startDate.setDate(startDate.getDate() + 1);
  endDate.setDate(endDate.getDate() - 1);


  let randomDate = getRandomDate(startDate, endDate);
  
  let startTimestamp = randomDate.toISOString();
  let unencryptedVote = {
    voterCI: voter.ci,
    electionId,
    circuitId,
    candidateCI,
    startTimestamp,
  };

  // Para autocannon
  client.setHeadersAndBody(
    {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    JSON.stringify(unencryptedVote)
  );

  let currentVoterElection = { voterCI: voter.ci, electionId: electionId };
  let alreadyVoted = false;

  for (let i = 0; i < previousVoterElection.length && !alreadyVoted; ++i) {
    let previousCI = previousVoterElection[i].voterCI;
    let previousElection = previousVoterElection[i].electionId;

    if (
      previousCI == currentVoterElection.voterCI &&
      previousElection == currentVoterElection.electionId
    ) {
      alreadyVoted = true;
    }
  }

  if (alreadyVoted) {
    console.log("Already Voted: ", currentVoterElection);
  }
  previousVoterElection.push(currentVoterElection);
  // // Para unirest
  // return unencryptedVote;
}

function encryptedVote(vote) {
  // let vote = {
  //   electionId,
  //   circuitId,
  //   candidateCI,
  // };
  // let stringifiedVote = JSON.stringify(vote);
  //  let encrypted =  voteEncryptor(stringifiedVote);
}

function getRandomDate(from, to) {
  const fromTime = from.getTime();
  const toTime = to.getTime();
  return new Date(fromTime + Math.random() * (toTime - fromTime));
}

function formatDate(date) {
  date += "Z";
  let result = date.replace(" ", "T");
  return new Date(result);
}

// makeRequests(300000);
const autocannon = require("autocannon");

let toSend =1;

console.log("Upcoming votes: ", toSend);

autocannon(
  {
    url: url + endpoint,
    method: "POST",
    amount: toSend,
    connections: toSend,
    duration: 5000,
    setupClient: setupVote,
  },
  console.log
);

// async function makeRequest(body) {
//   unirest
//     .post(url + endpoint)
//     .headers({ Accept: "application/json", "Content-Type": "application/json" })
//     .send(body)
//     .then((response) => {
//       console.log(response.body);
//     });
// }

// var unirest = require("unirest");
// makeRequest(setupVote("client"));

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
