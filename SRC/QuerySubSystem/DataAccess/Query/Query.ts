import { CommandMongo } from "../Command/CommandMongo";
import { QueryMongo } from "./QueryMongo";
import { QueryCache } from "../../../Common/Redis/QueryCache";
import { IUser } from "../../QueryAPI/Models/User";
import { QueryQueue } from "./QueryQueue";
import { ElectionVotesDTO } from "../../QueryAPI/Models/ElectionVotesDTO";
import { NotificationSettingsDTO } from "../../QueryAPI/Models/NotificationSettingsDTO";
import { ElectionInfo, Vote, Voter } from "../../../Common/Domain";
import {
  DateFrequencyDTO,
  ElectionDateFrequencyDTO,
} from "../../QueryAPI/Models/ElectionDateFrequencyDTO";
import { ElectionInfoPerCircuitDTO } from "../../QueryAPI/Models/ElectionInfoPerCircuitDTO";
import { ElectionInfoPerStateDTO } from "../../QueryAPI/Models/ElectionInfoPerStateDTO";

export class Query {
  static _instance: Query;
  queryQueue: QueryQueue;
  queryCache: QueryCache;

  constructor() {
    this.queryQueue = new QueryQueue();
    this.queryCache = new QueryCache();
  }

  static getQuery(): Query {
    if (!Query._instance) {
      Query._instance = new Query();
    }
    return Query._instance;
  }

  public async findByEmailOrFail(email: string): Promise<IUser> {
    return await QueryMongo.findByEmailOrFail(email);
  }

  public async getVotes(electionId: number, voterCI: string): Promise<ElectionVotesDTO> {
    let electionExists: boolean = await this.queryCache.existsElection(electionId);
    if (electionExists) {
      let queryResult: string[] = await this.queryQueue.getVotes(electionId, voterCI);
      let result: ElectionVotesDTO = new ElectionVotesDTO(electionId, voterCI, queryResult);
      return result;
    }
    throw new Error(`Election ${electionId} does not exist`);
  }

  public async getVote(voteId: string, voterCI: string): Promise<Vote | null> {
    let queryResult: Vote | null = await this.queryQueue.getVote(voteId, voterCI);
    return queryResult;
  }

  public async getVoter(ci: string): Promise<Voter> {
    let found: Voter = await this.queryQueue.getVoter(ci);
    return found;
  }

  public async getElection(electionId: number): Promise<ElectionInfo> {
    let result: ElectionInfo | null = await this.queryCache.getElection(electionId);
    console.log("Busco " + electionId + " en cache");
    if (!result) {
      throw new Error("Election not found");
    }
    return result;
  }

  public async existsElection(id: number): Promise<boolean> {
    return await this.queryCache.existsElection(id);
  }

  async getElectionConfig(id: number): Promise<NotificationSettingsDTO> {
    let electionInfo: any = await this.queryCache.getElection(id);
    let settings = new NotificationSettingsDTO(
      electionInfo.id,
      electionInfo.maxVotesPerVoter,
      electionInfo.maxVoteRecordRequestsPerVoter,
      electionInfo.emails
    );
    return settings;
  }

  public async getVoteFrequency(electionId: any): Promise<ElectionDateFrequencyDTO> {
    let electionExists: boolean = await this.queryCache.existsElection(electionId);
    if (electionExists) {
      let queryResult: any[] = await this.queryQueue.getVoteFrequency(electionId);
      let electionDateFrequencyDTO: ElectionDateFrequencyDTO = new ElectionDateFrequencyDTO(
        electionId,
        queryResult
      );
      return electionDateFrequencyDTO;
    }
    throw new Error(`Election ${electionId} does not exist`);
  }


  public async getElectionInfoCountPerCircuit(
    electionId: number,
    minAge: number,
    maxAge: number,
    gender: string
  ): Promise<ElectionInfoPerCircuitDTO> {
    let electionExists: boolean = await this.queryCache.existsElection(electionId);
    if (electionExists) {
      let response: any[] = await this.queryQueue.getElectionInfoCountPerCircuit(
        electionId,
        minAge,
        maxAge,
        gender
      );
      let electionCircuitInfoDTO: ElectionInfoPerCircuitDTO = new ElectionInfoPerCircuitDTO(
        electionId,
        response
      );
      return electionCircuitInfoDTO;
    }
    throw new Error(`Election ${electionId} does not exist`);
  }

  public async getElectionInfoCountPerState(
    electionId: number,
    minAge: number,
    maxAge: number,
    gender: string
  ): Promise<ElectionInfoPerStateDTO> {
    let electionExists: boolean = await this.queryCache.existsElection(electionId);
    if (electionExists) {
      let response: any[] = await this.queryQueue.getElectionInfoCountPerState(
        electionId,
        minAge,
        maxAge,
        gender
      );
      let electionStateInfoDTO: ElectionInfoPerStateDTO = new ElectionInfoPerStateDTO(
        electionId,
        response
      );
      return electionStateInfoDTO;
    }
    throw new Error(`Election ${electionId} does not exist`);
  }

  public async getVoteProofLogCount(voterCI: string, electionId: number): Promise<number>{
    return QueryMongo.getVoteProofLogCount(voterCI, electionId);
  }
  // async addUser(email: string, password: string, role: string): Promise<void> {
  //   await UserCommand.addUser(email, password, role);

  //   return;
  // }
}
