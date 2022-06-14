export class ElectionInfoDTO {
  electionId: number;
  totalVoters: number;
  totalVotes: number;
  candidateResult: CandidateResultDTO[];
  partyResult: PartyResultDTO[];
  stateInfo: StateInfoDTO[];

  constructor(
    electionId: number,
    totalVoters: number,
    totalVotes: number,
    candidateResult: CandidateResultDTO[],
    partyResult: PartyResultDTO[],
    stateInfo: StateInfoDTO[]
  ) {
    this.electionId = electionId;
    this.totalVoters = totalVoters;
    this.totalVotes = totalVotes;
    this.candidateResult = candidateResult;
    this.partyResult = partyResult;
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

export interface PartyResultDTO {
  partyId: number;
  partyName: string;
  voteCount: number;
}

export interface CandidateResultDTO {
  candidateCI: number;
  fullName: string;
  voteCount: number;
}
