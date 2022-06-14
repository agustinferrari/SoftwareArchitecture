export class ElectionInfoPerStateDTO {
  electionId: number;
  stateInfo: StateInfoDTO[];

  constructor(electionId: number, stateInfo: StateInfoDTO[]) {
    this.electionId = electionId;
    this.stateInfo = stateInfo;
  }
}

export class StateInfoDTO {
  stateName: string;
  voters: number;
  votes: number;

  constructor(stateName: string, voters: number, votes: number) {
    this.stateName = stateName;
    this.voters = voters;
    this.votes = votes;
  }
}
