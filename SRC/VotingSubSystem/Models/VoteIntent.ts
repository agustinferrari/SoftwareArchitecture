export class VoteIntent {
  ci: string;
  circuitId: number;
  electionId: number;
  candidateCI: string;
  constructor(
    ci: string,
    circuitId: number,
    electionId: number,
    candidateCI: string
  ) {
    this.ci = ci;
    this.circuitId = circuitId;
    this.electionId = electionId;
    this.candidateCI = candidateCI;
  }
}
