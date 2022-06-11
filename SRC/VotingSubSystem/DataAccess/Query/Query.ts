import { Voter, ElectionInfo } from "../../../Common/Domain";
import { QueryQueue } from "./QueryQueue";
import { QueryCache } from "../../../Common/Redis/QueryCache";
export class Query {
  voterQueryQueue: QueryQueue;
  queryCache: QueryCache;

  constructor(voterQuerySQL: QueryQueue, queryCache: QueryCache) {
    this.voterQueryQueue = voterQuerySQL;
    this.queryCache = queryCache;
  }

  public async getVoter(ci: string): Promise<Voter> {
    let found: Voter = await this.voterQueryQueue.getVoter(ci);
    return found;
  }

  public async getElection(electionId: number): Promise<ElectionInfo> {
    let result: ElectionInfo | null = await this.queryCache.getElection(electionId);
    if (!result) {
      throw new Error("Election not found");
    }
    return result;
  }
}
