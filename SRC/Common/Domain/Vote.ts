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

  public randomizeAndSetId() {
    const randomIdLength = 8;
    let minRandom = Math.pow(10, randomIdLength);
    let maxRandom = Math.pow(10, randomIdLength+1)-1;
    let randomElectionIdentifier = this.randomIntFromInterval(minRandom,maxRandom);
    let randomIdentifier = this.randomIntFromInterval(minRandom,maxRandom);
    let result = `${this.electionId}${randomElectionIdentifier}${randomIdentifier}`;
    this.id= result;
  }

  private randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
