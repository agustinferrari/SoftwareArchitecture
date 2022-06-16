const ElectionGenerator = require("./ElectionGenerator");
const VoterPool = require("./VoterPool");
const MongoAccess = require("../../MongoUtilities/mongoAccess");
const prompt = require("prompt-sync")({ sigint: true });

console.log("Generating election in mongo");

const electionNumber = prompt("Cuantos elecciones desea generar? ");
const circuitNumber = prompt("Cuantos circuitos? ");
const partyNumber = prompt("Cuantos partidos? ");
const candidateNumber = prompt("Cuantos candidatos? ");
const voterNumber = prompt("Cuantos votantes? ");
const ESC = "\x1b"; // ASCII escape character
const CSI = ESC + "["; // control sequence introducer

function writeChangingLine(name, count) {
  clearLastLine();
  if (count) {
    process.stdout.write(
      "\n" +
        name +
        count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") +
        "\r"
    );
  }
}

function clearLastLine() {
  process.stdout.write(CSI + "A"); // moves cursor up one line
  process.stdout.write(CSI + "K"); // clears from cursor to line end
}

let electionGenerator = new ElectionGenerator(
  circuitNumber,
  partyNumber,
  candidateNumber,
  voterNumber
);

let voterPool = new VoterPool();
voterPool.generateVoters(voterNumber * electionNumber);
let elections = electionGenerator.generateElections(electionNumber);
let voters = [];
console.log();

for (let electionPos = 0; electionPos < elections.length; electionPos++) {
  let currentElection = elections[electionPos];
  currentElection.voters = [];
  for (let i = 0; i < voterNumber; i++) {
    let voter = voterPool.getVoter(
      currentElection.circuits,
      currentElection.id
    );
    // currentElection.voters.push(voter);
    voters.push(voter);
    writeChangingLine(
      "Loading voters for election: " +
        currentElection.id +
        " | Max votercount " +
        voterNumber+1 +
        " | Current votercount ",
      i
    );
  }
}
clearLastLine();
clearLastLine();
clearLastLine();
console.log();
console.log();
console.log();
console.log();
console.log();
console.log();
console.log();

console.log();
console.log("Total Voter Count: ", voters.length);
const fs = require("fs");

var mongoAccess = new MongoAccess();
try {
  VoterInfoLoad(voters);
  APILoad(elections);
} catch (error) {
  console.error(error);
}

async function VoterInfoLoad(voters) {
  try {
    await mongoAccess.saveVoters(voters);
  } catch (error) {
    console.error(error);
  }
}

async function APILoad(elections) {
  try {
    await mongoAccess.saveElections(elections);
  } catch (error) {
    console.error(error);
  }
}

// await mongoAccess.saveVotingInformation(
//   voters.map((el) => {
//     let ci = el.ci;
//     let electionId = el.electionId;
//     let circuitId = el.circuitId;
//     let credential = el.credential;
//     let privateKey = el.privateKey;
//     let publicKey = el.publicKey;
//     delete el.privateKey;

//     return {
//       ci,
//       electionId,
//       circuitId,
//       credential,
//       privateKey,
//       publicKey,
//     };
//   })
// );
