export class ElectionResult {
  candidatesResult: CandidateResult[];
  partiesResult: PartyResult[];

  constructor(candidatesResult: CandidateResult[], partiesResult: PartyResult[]) {
    this.candidatesResult = candidatesResult;
    this.partiesResult = partiesResult;
  }
}

export interface PartyResult {
  partyId: number;
  partyName: string;
  voteCount: number;
}

export interface CandidateResult {
  candidateCI: number;
  fullName: string;
  voteCount: number;
}
