const { faker } = require("@faker-js/faker");
const CircuitGenerator = require("./CircuitGenerator");
const PartyGenerator = require("./PartyGenerator");
const CandidateGenerator = require("./CandidateGenerator");
const VoterGenerator = require("./VoterGenerator");

class ElectionGenerator {
  constructor(circuitNumber, partyNumber, candidateNumber, voterNumber) {
    this.elections = [];
    this.voters = [];
    this.circuitNumber = circuitNumber;
    this.partyNumber = partyNumber;
    this.candidateNumber = candidateNumber;
    this.voterNumber = voterNumber;
    // this.votersElection = [];
    //this.generateAuxData();
  }

  generateAuxData(electionId) {
    this.circuitGenerator = new CircuitGenerator();
    this.partyGenerator = new PartyGenerator();
    this.circuits = this.circuitGenerator.generateCircuits(this.circuitNumber);
    this.parties = this.partyGenerator.generateParties(this.partyNumber);

    this.candidateGenerator = new CandidateGenerator(this.parties);
    this.candidates = this.candidateGenerator.generateCandidates(this.candidateNumber);

    // this.voterGenerator = new VoterGenerator(this.circuits);
    // this.votersElection = this.voterGenerator.generateVoters(this.voterNumber, electionId);
  }

  generateElection() {
    let id = faker.unique(faker.datatype.number);
    let name = "Election " + faker.name.jobArea();
    let description = faker.lorem.sentence();
    let startDate = this.formatDate(faker.date.future().toString());
    let endDate = this.formatDate(faker.date.future(1, startDate));
    let mode = ["unique", "repeated"][Math.floor(Math.random() * 2)];
    let emails = [];
    for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
      emails.push(faker.internet.email());
    }
    //let circuits = this.getRandomSubarray(this.circuits, this.circuitNumber/3);
    //let parties = this.getRandomSubarray(this.parties, this.circuitNumber/3);
    //let candidates = this.getRandomSubarray(this.candidates, this.circuitNumber/3);
    //let voters =  this.getRandomSubarray(this.voters, this.circuitNumber/3);
    this.generateAuxData(id);
    let circuits = this.circuits;
    let parties = this.parties;
    let candidates = this.candidates;

    // let voters = this.voters;

    // let election = { id, name, description, startDate, endDate, mode, circuits, parties, candidates, voters };
    let election = {
      id,
      name,
      description,
      startDate,
      endDate,
      mode,
      circuits,
      parties,
      candidates,
      emails
    };

    return election;
  }

  generateElections(numberOfElections) {
    for (let i = 0; i < numberOfElections; i++) {
      let election = this.generateElection();
      this.elections.push(election);
      // let voters = this.voterGenerator.generateVoters(
      //   this.voterNumber,
      //   election.id
      // );
      // voters.forEach((v) => {
      //   this.voters.push(v);
      // });
    }

    return this.elections;
  }

  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear(),
      hours = d.getHours(),
      minutes = d.getMinutes(),
      seconds = d.getSeconds();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-") + " " + [hours, minutes, seconds].join(":");
  }

  getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0),
      i = arr.length,
      min = i - size,
      temp,
      index;
    while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
    }
    return shuffled.slice(min);
  }
}

module.exports = ElectionGenerator;
