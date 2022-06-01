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
let voters = result[1][0];
//console.log(JSON.stringify(elections));

const fs = require("fs");
try {
  let data = fs.readFileSync("../SimulatedElectoralAPI.json");
  let json = JSON.parse(data);
  elections.forEach((election) => {
    json.elections.push(election);
  });
  voters.forEach((voter) => {
    console.log(voter);
    json.voters.push(voter);
  });
  fs.writeFileSync("../SimulatedElectoralAPI.json", JSON.stringify(json));
} catch (error) {
  console.error(error);
}
