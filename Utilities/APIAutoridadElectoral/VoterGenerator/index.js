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
let elections = electionGenerator.generateElections(electionNumber);
//console.log(JSON.stringify(elections));

const fs = require("fs");
try {
  let data = fs.readFileSync("../SimulatedElectoralAPI.json");
  let json = JSON.parse(data);
  elections.forEach((election) => {
    json.elections.push(election);
  });
  fs.writeFileSync("../SimulatedElectoralAPI.json", JSON.stringify(json));
  console.log("JSON data is saved.");
} catch (error) {
  console.error(error);
}
