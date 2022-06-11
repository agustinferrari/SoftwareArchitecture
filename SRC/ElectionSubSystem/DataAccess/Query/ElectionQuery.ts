import { ElectionInfo } from "../../../Common/Domain";
import { QueryCache } from "./../../../Common/Redis/CacheQuery";
import { ElectionQueryQueue } from "./ElectionQueryQueue";

export class ElectionQuery {
  electionCache: QueryCache;
  electionQueryQueue: ElectionQueryQueue;
  constructor(electionCache: QueryCache, electionQuerySQL: ElectionQueryQueue) {
    this.electionCache = electionCache;
    this.electionQueryQueue = electionQuerySQL;
    //this.startupRedis();
  }

  // private async startupRedis() {
  //   let status: boolean = await this.electionCache.getStatus();
  //   if (!status) {
  //     let electionInfos: ElectionInfo[] = await this.electionQueryQueue.getElectionsInfo();
  //     for (let i = 0; i < electionInfos.length; i++) {
  //       await this.electionCache.addElection(electionInfos[i]);
  //     }
  //     this.electionCache.setStatus();
  //   }
  // }

  public async existsElection(electionId: number): Promise<boolean> {
    let result = await this.electionCache.getElection(electionId);
    return result != null;
  }
}
