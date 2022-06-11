export class Vote {
  id: string;
  voterCI: string;
  candidateCI?: string;
  electionId: number;

  startTimestamp: Date;
  endTimestamp: Date;
  responseTime: number;
<<<<<<< HEAD
  id: string;
  voterCI: string;
  electionID: number;
=======

>>>>>>> develop
  constructor() {
    this.startTimestamp = new Date();
    this.endTimestamp = new Date();
    this.responseTime = 0;
    this.id = "";
    this.voterCI = "";
<<<<<<< HEAD
    this.electionID = 0;
=======
    this.candidateCI = "";
    this.electionId = -1;
>>>>>>> develop
  }
}
