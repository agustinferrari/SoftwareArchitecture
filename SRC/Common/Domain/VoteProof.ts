import { Voter, ElectionInfo, Vote } from "./";

export class VoteProof {
  election: ElectionInfo;
  voter: Voter;
  vote: Vote;
  public constructor(vote: Vote, voter: Voter, election : ElectionInfo) {
    this.election = election;
    this.voter = voter;
    this.vote = vote;
  }

  public ToString(): string {
    let electionData = `ElectionId: ${this.election.id} | ElectionName: ${this.election.name}`;
    let voterData = `FechaDeVoto: ${this.vote.startTimestamp} | CI: ${this.voter.ci}`;
    let voterName = `Votante: ${this.voter.name} ${this.voter.lastName}`;
    let voteIdentificator = `Voto: ${this.vote.id}`;
    return `[${electionData} | ${voterData} | ${voterName} | ${voteIdentificator}]`;
  }
}
