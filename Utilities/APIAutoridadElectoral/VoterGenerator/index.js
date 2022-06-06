const ElectionGenerator = require("./ElectionGenerator");

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
let result = electionGenerator.generateElections(electionNumber);
let elections = result[0];
let voters = result[1];
console.log(voters.length);
//console.log(JSON.stringify(elections));
let filePath = "../SimulatedElectoralAPI.json";
const fs = require("fs");
try {
  let data = fs.readFileSync(filePath);
  let json = JSON.parse(data);

  elections.forEach((election) => {
    json.elections.push(election);
  });
  voters.forEach((voter) => {
    json.voters.push(voter);
  });

  fs.writeFileSync(filePath, "");
  fs.appendFileSync(
    filePath,
    `{`
  );
  fs.appendFileSync(
    filePath,
    `"elections":[`
  );
  let lengthElections = json.elections.length;
  for(let i =0; i< lengthElections;i++){
    let el = json.elections[i];
    let toPrint = `${JSON.stringify(el)}`;
    if(i<lengthElections-1){
      toPrint+= ",";
    }
    fs.appendFileSync(filePath, toPrint);
  }
  fs.appendFileSync(
    filePath,
    `],`
  );

  fs.appendFileSync(
    filePath,
    `"voters":[`
  );
  let lengthVoters = json.voters.length;
  for(let i =0; i< lengthVoters;i++){
    let el = json.voters[i];
    let toPrint = `${JSON.stringify(el)}`;
    if(i<lengthVoters-1){
      toPrint+= ",";
    }
    fs.appendFileSync(filePath, toPrint);
  }
  fs.appendFileSync(
    filePath,
    `],`
  );

  fs.appendFileSync(
    filePath,
    `"emails":[`
  );
  let lengthEmails = json.emails.length;
  for(let i =0; i< lengthEmails;i++){
    let el = json.emails[i];
    let toPrint = `${JSON.stringify(el)}`;
    if(i<lengthEmails-1){
      toPrint+= ",";
    }
    fs.appendFileSync(filePath, toPrint);
  }
  fs.appendFileSync(
    filePath,
    `],`
  );

  fs.appendFileSync(
    filePath,
    `"messages":[`
  );

  let lengthMessages = json.messages.length;
  for(let i =0; i< lengthMessages;i++){
    let el = json.messages[i];
    let toPrint = `${JSON.stringify(el)}`;
    if(i<lengthMessages-1){
      toPrint+= ",";
    }
    fs.appendFileSync(filePath, toPrint);
  }
  fs.appendFileSync(
    filePath,
    `]`
  );
  fs.appendFileSync(
    filePath,
    `}`
  );
  console.log();
  console.log("JSON data is saved");
} catch (error) {
  console.error(error);
}
