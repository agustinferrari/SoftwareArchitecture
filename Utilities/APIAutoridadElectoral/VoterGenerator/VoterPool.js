const VoterGenerator = require("./VoterGenerator");

class VoterPool {
  constructor() {
    this.voters = [];
    this.VoterGenerator = new VoterGenerator();
    this.currentIndex = 0;
  }
  getVoter(circuits, electionId) {
    let circuitId = circuits[Math.floor(Math.random() * circuits.length)].id;
    let voter = this.voters[this.currentIndex];
    this.currentIndex++;
    voter.circuitId = circuitId;
    voter.electionId = electionId;
    return voter;
  }

  generateVoters(voterNumber) {
    this.voters = this.VoterGenerator.generateVoters(voterNumber);
  }
}
module.exports = VoterPool;
