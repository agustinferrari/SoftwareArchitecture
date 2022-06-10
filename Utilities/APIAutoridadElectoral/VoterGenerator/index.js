const ElectionGenerator = require("./ElectionGenerator");
const VoterPool = require("./VoterPool");
const prompt = require("prompt-sync")({ sigint: true });
const electionNumber = prompt("Cuantos elecciones desea generar? ");
const circuitNumber = prompt("Cuantos circuitos? ");
const partyNumber = prompt("Cuantos partidos? ");
const candidateNumber = prompt("Cuantos candidatos? ");
const voterNumber = prompt("Cuantos votantes? ");

const ESC = "\x1b"; // ASCII escape character
const CSI = ESC + "["; // control sequence introducer

function writeChangingLine(name, count) {
  clearLastLine();
  if(count){
    process.stdout.write(
      "\n" + name + count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "\r"
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

let voterPool  = new VoterPool();
voterPool.generateVoters(voterNumber*electionNumber);
let elections = electionGenerator.generateElections(electionNumber);
let voters = []
console.log();

for(let electionPos = 0; electionPos< elections.length ; electionPos++){
  let currentElection = elections[electionPos];
  currentElection.voters= []
  for(let i =0; i< voterNumber; i++){
    let voter = voterPool.getVoter(currentElection.circuits, currentElection.id);
    currentElection.voters.push(voter);
    voters.push(voter);
    writeChangingLine("Loading voters for elecion: "+ currentElection.id + " | Max votercount " +  voterNumber + " | Current votercount ", i);
  }
}

console.log();
console.log("Total Voter Count: ", voters.length);
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
      writeChangingLine("Max Voters: " + lengthVoters + " | Current Voters: ", i);
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
      delete el.voters;
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
    console.log();
    console.log();
    console.log();
    console.log();
    console.log();
    console.log("JSON data is saved");
  } catch (error) {
    console.error(error);
  }
}
