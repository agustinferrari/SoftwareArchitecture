export class Vote {
  startTimestamp: Date;
  endTimestamp: Date;
  responseTime: number;
  id: string;
  voterCI: string;
  electionID: number;
  constructor() {
    this.startTimestamp = new Date();
    this.endTimestamp = new Date();
    this.responseTime = 0;
    this.id = "";
    this.voterCI = "";
    this.electionID = 0;
  }
}
