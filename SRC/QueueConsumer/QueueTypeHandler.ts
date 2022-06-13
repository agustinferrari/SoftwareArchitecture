import { ElectionInfo, Vote } from "../Common/Domain";
import { CommandSQL } from "./CommandSQL";
import { QuerySQL } from "./QuerySQL";
import { QueryCache } from "./../Common/Redis/";

export class QueueTypeHandler {
  query: QuerySQL;
  command: CommandSQL;

  constructor(query: QuerySQL, command: CommandSQL) {
    this.query = query;
    this.command = command;
  }

  public async voterElectionCircuit(input: any): Promise<boolean> {
    //TODO ver si validar que no esten vacios
    return await this.query.voterElectionCircuit(input.voterCI, input.electionId, input.circuitId);
  }

  public async getVoter(input: any) {
    //TODO ver si validar que sea ci
    return await this.query.getVoter(input.ci);
  }

  public async getElectionsInfo(input: any): Promise<ElectionInfo[]> {
    //TODO ver si validar que no esten vacios
    return await this.query.getElectionsInfo();
  }

  public async addElection(input: any): Promise<string> {
    //TODO ver si validar que no esten vacios
    await this.command.addElection(input);
    return "Added sucessfully";
  }

  public async addVoters(input: any): Promise<string> {
    //TODO ver si validar que no esten vacios
    await this.command.addVoters(input.voters, input.electionId);
    return "Added sucessfully";
  }

  public async addVote(input: any): Promise<string> {
    //TODO ver si validar que no esten vacios
    await this.command.addVote(input.vote, input.mode);
    return "Added sucessfully";
  }

  public async checkUniqueVote(input: any): Promise<boolean> {
    //TODO ver si validar que no esten vacios
    return await this.query.checkUniqueVote(input.voterCI, input.electionId);
  }

  public async checkRepeatedVote(input: any): Promise<boolean> {
    //TODO ver si validar que no esten vacios
    return (
      input.maxVotesPerVoter > (await this.query.checkRepeatedVote(input.voterCI, input.electionId))
    );
  }

  public async getVoteDates(input: any): Promise<string[]> {
    return await this.query.getVoteDates(input.electionId, input.voterCI);
  }

  public async getVote(input: any): Promise<Vote> {
    return await this.query.getVote(input.voteId, input.voterCI);
  }

  public async getVoteFrequency(input: any): Promise<any[]> {
    return await this.query.getVoteFrequency(input.electionId, input.voterCI);
  }

  public async getTotalVotes(input: any): Promise<number> {
    return await this.query.getTotalVotes(input.electionId);
  }
}
