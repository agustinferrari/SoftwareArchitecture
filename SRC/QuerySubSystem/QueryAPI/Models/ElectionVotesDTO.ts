export class ElectionVotesDTO {
  electionId: number;
  voterCI: string;
  voteDates: string[];

  constructor(electionId: number, voterCI: string, voteDates: string[]) {
    this.electionId = electionId;
    this.voterCI = voterCI;
    this.voteDates = voteDates;
  }
}
