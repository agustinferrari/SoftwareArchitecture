import { Candidate, ElectionInfo, Party } from "../../../Common/Domain";
import { QueryCache } from "../../../Common/Redis/QueryCache";
import { ElectionQueryQueue } from "./ElectionQueryQueue";
import { QueryMongo } from "./QueryMongo";

export class ElectionQuery {
  electionCache: QueryCache;
  electionQueryQueue: ElectionQueryQueue;
  static instance: ElectionQuery;
  constructor() {
    this.electionCache = new QueryCache();
    this.electionQueryQueue = new ElectionQueryQueue();
  }

  public static getInstance(): ElectionQuery {
    if (!ElectionQuery.instance) {
      ElectionQuery.instance = new ElectionQuery();
    }
    return ElectionQuery.instance;
  }

  public async existsElection(electionId: number): Promise<boolean> {
    return await this.electionCache.existsElection(electionId);
  }

  public async getElectionParties(electionId: number): Promise<Party[]> {
    return await this.electionQueryQueue.getElectionParties(electionId);
  }

  public async getElectionCandidates(electionId: number): Promise<Candidate[]> {
    return await this.electionQueryQueue.getElectionCandidates(electionId);
  }

  public async getElectionsInfo(): Promise<ElectionInfo[]> {
    return await QueryMongo.getElectionInfos();
  }

  public async getElectionEmails(electionId: number): Promise<string[]> {
    let result = await this.electionCache.getElection(electionId);
    if (result) {
      return result.emails;
    } else {
      return [];
    }
  }

  public async validateElectionVotesDate(electionId: number): Promise<boolean> {
    let result = await this.electionCache.getElection(electionId);
    if (result) {
      return this.electionQueryQueue.validateElectionVotesDate(electionId);
    }
    throw Error("Election " + electionId + "not found");
  }

  public async validateElectionVotesCount(electionId: number): Promise<boolean> {
    let result = await this.electionCache.existsElection(electionId);
    if (result) {
      return this.electionQueryQueue.validateElectionVotesCount(electionId);
    }
    throw Error("Election " + electionId + "not found");
  }
}
