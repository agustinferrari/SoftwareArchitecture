export class VoteIntent {
  voterCI: string;
  circuitId: number;
  electionId: number;
  candidateCI: string;
  startTimestamp: Date;
  constructor(ci: string, circuitId: number, electionId: number, candidateCI: string, startTimestamp: Date) {
    this.voterCI = ci;
    this.circuitId = circuitId;
    this.electionId = electionId;
    this.candidateCI = candidateCI;
    this.startTimestamp = startTimestamp;
  }
}
