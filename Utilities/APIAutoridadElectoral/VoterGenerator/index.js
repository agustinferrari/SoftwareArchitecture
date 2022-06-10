const ElectionGenerator = require("./ElectionGenerator");
const VoterPool = require("./VoterPool");
const prompt = require("prompt-sync")({ sigint: true });
const electionNumber = prompt("Cuantos elecciones desea generar? ");
const circuitNumber = prompt("Cuantos circuitos? ");
const partyNumber = prompt("Cuantos partidos? ");
const candidateNumber = prompt("Cuantos candidatos? ");
const voterNumber = prompt("Cuantos votantes? ");

let electionGenerator = new ElectionGenerator(
  circuitNumber,
  partyNumber,
  candidateNumber,
  voterNumber
);

let voterPool  = new VoterPool();
voterPool.generateVoters(voterNumber*electionNumber);
let elections = electionGenerator.generateElections(electionNumber);

for(let electionPos = 0; electionPos< elections.length ; electionPos++){
  let currentElection = elections[electionPos];

}

// let elections = result[0];
// let voters = result[1];
console.log();
console.log("Total Voter Count: ", voters.length);
//console.log(JSON.stringify(elections));
const fs = require("fs");

try {
  VoterInfoLoad(voters);
  APILoad(elections, voters);
} catch (error) {
  console.error(error);
}

function VoterInfoLoad(voters) {
  let filePathAPI = "../VoterVotingInformation.json";
  try {
    let data = fs.readFileSync(filePathAPI);
    let json = JSON.parse(data);
    voters.forEach((voter) => {
      json.voters.push(voter);
    });
    fs.writeFileSync(filePathAPI, "");
    fs.appendFileSync(filePathAPI, `{`);
    fs.appendFileSync(filePathAPI, `"voters":[`);
    let lengthVoters = json.voters.length;
    for (let i = 0; i < lengthVoters; i++) {
      let el = json.voters[i];

      let ci = el.ci;
      let electionId = el.electionId;
      let circuitId = el.circuitId;
      let credential = el.credential;
      let privateKey = el.privateKey;
      let publicKey = el.publicKey;

      let voter = {
        ci,
        electionId,
        circuitId,
        credential,
        privateKey,
        publicKey,
      };

      delete el.privateKey;

      let toPrint = `${JSON.stringify(voter)}`;
      if (i < lengthVoters - 1) {
        toPrint += ",";
      }
      fs.appendFileSync(filePathAPI, toPrint);
    }
    fs.appendFileSync(filePathAPI, `]`);
    fs.appendFileSync(filePathAPI, `}`);
  } catch (error) {
    console.error(error);
  }
}

function APILoad(elections, voters) {
  let filePathAPI = "../SimulatedElectoralAPI.json";

  try {
    let data = fs.readFileSync(filePathAPI);
    let json = JSON.parse(data);

    elections.forEach((election) => {
      json.elections.push(election);
    });
    voters.forEach((voter) => {
      json.voters.push(voter);
    });

    fs.writeFileSync(filePathAPI, "");
    fs.appendFileSync(filePathAPI, `{`);
    fs.appendFileSync(filePathAPI, `"elections":[`);
    let lengthElections = json.elections.length;
    for (let i = 0; i < lengthElections; i++) {
      let el = json.elections[i];
      let toPrint = `${JSON.stringify(el)}`;
      if (i < lengthElections - 1) {
        toPrint += ",";
      }
      fs.appendFileSync(filePathAPI, toPrint);
    }
    fs.appendFileSync(filePathAPI, `],`);

    fs.appendFileSync(filePathAPI, `"voters":[`);
    let lengthVoters = json.voters.length;
    for (let i = 0; i < lengthVoters; i++) {
      let el = json.voters[i];
      let toPrint = `${JSON.stringify(el)}`;
      if (i < lengthVoters - 1) {
        toPrint += ",";
      }
      fs.appendFileSync(filePathAPI, toPrint);
    }
    fs.appendFileSync(filePathAPI, `],`);

    fs.appendFileSync(filePathAPI, `"emails":[`);
    let lengthEmails = json.emails.length;
    for (let i = 0; i < lengthEmails; i++) {
      let el = json.emails[i];
      let toPrint = `${JSON.stringify(el)}`;
      if (i < lengthEmails - 1) {
        toPrint += ",";
      }
      fs.appendFileSync(filePathAPI, toPrint);
    }
    fs.appendFileSync(filePathAPI, `],`);

    fs.appendFileSync(filePathAPI, `"messages":[`);

    let lengthMessages = json.messages.length;
    for (let i = 0; i < lengthMessages; i++) {
      let el = json.messages[i];
      let toPrint = `${JSON.stringify(el)}`;
      if (i < lengthMessages - 1) {
        toPrint += ",";
      }
      fs.appendFileSync(filePathAPI, toPrint);
    }
    fs.appendFileSync(filePathAPI, `]`);
    fs.appendFileSync(filePathAPI, `}`);

    console.log();
    console.log("JSON data is saved");
  } catch (error) {
    console.error(error);
  }
}
