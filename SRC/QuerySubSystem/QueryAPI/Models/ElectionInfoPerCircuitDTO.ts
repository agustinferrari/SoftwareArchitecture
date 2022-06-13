export class ElectionInfoPerCircuitDTO {
  electionId: number;
  circuitInfo: CircuitInfoDTO[];

  constructor(electionId: number, circuitInfo: CircuitInfoDTO[]) {
    this.electionId = electionId;
    this.circuitInfo = circuitInfo;
  }
}

export class CircuitInfoDTO {
  circuitId: number;
  voters: number;
  votes: number;

  constructor(circuitId: number, voters: number, votes: number) {
    this.circuitId = circuitId;
    this.voters = voters;
    this.votes = votes;
  }
}
