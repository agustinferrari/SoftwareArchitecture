import { ElectionInfo } from "../../../Common/Domain";
import { ElectionCache } from "./../../../Common/Redis/ElectionCache";
import { ElectionQuerySQL } from "./ElectionQuerySQL";

export class ElectionQuery {
  electionCache: ElectionCache;
  electionQuerySQL: ElectionQuerySQL;
  constructor( electionCache: ElectionCache, electionQuerySQL: ElectionQuerySQL) {
    this.electionCache = electionCache;
    this.electionQuerySQL = electionQuerySQL;
    this.startupRedis();
  }

  private async startupRedis() {
    let status: boolean = await this.electionCache.getStatus();
    if (!status) {
      let electionInfos: ElectionInfo[] =
        await this.electionQuerySQL.getElectionInfos();
      for (let i = 0; i < electionInfos.length; i++) {
        this.electionCache.addElection(electionInfos[i]);
      }
      this.electionCache.setStatus();
    }
  }

  public async existsElection(electionId: number): Promise<boolean> {
    let result = await this.electionCache.getElection(electionId);
    return result != null;
  }
}
