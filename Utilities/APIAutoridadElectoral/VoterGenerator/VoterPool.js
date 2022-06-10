const VoterGenerator = require("./VoterGenerator");

class VoterPool {
  constructor(voterNumber, circuits) {
    this.voters = [];
    this.voterNumber = voterNumber;
    this.VoterGenerator = new VoterGenerator();
    this.currentIndex = 0;
  }
  getNewVoter(circuits) {
    let circuitId = circuits[Math.floor(Math.random() * circuits.length)].id;
    let voter = this.voters[this.currentIndex];
    this.currentIndex++;
    voter["circuitId"] = circuitId;
    return voter;
  }

  generateVoters() {
    this.voters = this.VoterGenerator.generateVoters(this.voterNumber);
  }
}
