export class Vote {
  startTimestamp: Date;
  endTimestamp: Date;
  responseTime: number;
  id: string;
  voterCI: string;
  constructor() {
    this.startTimestamp = new Date();
    this.endTimestamp = new Date();
    this.responseTime = 0;
    this.id = "";
    this.voterCI = "";
  }
}
