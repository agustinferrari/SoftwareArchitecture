import { ElectionCache } from "./../../../Common/Redis/ElectionCache";

export class ElectionQuery {
  electionCache: ElectionCache;

  constructor(electionCache: ElectionCache) {
    this.electionCache = electionCache;
  }

  public async existsElection(electionId: number): Promise<boolean> {
    let result = (await this.electionCache.getElection(electionId));
    return result != null;
  }
}
