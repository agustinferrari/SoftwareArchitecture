export class Vote {
  id: string;
  voterCI: string;
  candidateCI?: string;
  electionId: number;
  circuitId: number;

  startTimestamp: Date;
  endTimestamp: Date;
  responseTime: number;
  constructor() {
    this.startTimestamp = new Date();
    this.endTimestamp = new Date();
    this.responseTime = 0;
    this.id = "";
    this.voterCI = "";
    this.candidateCI = "";
    this.electionId = -1;
    this.circuitId = -1;
  }
}
