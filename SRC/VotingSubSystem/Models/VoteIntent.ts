export class VoteIntent {
  voterCI: string;
  circuitId: number;
  electionId: number;
  candidateCI: string;
  constructor(ci: string, circuitId: number, electionId: number, candidateCI: string) {
    this.voterCI = ci;
    this.circuitId = circuitId;
    this.electionId = electionId;
    this.candidateCI = candidateCI;
  }
}
