import { ElectionCache } from "./../../../Common/Redis/ElectionCache";
import { Election, ElectionInfo, Voter } from "../../../Common/Domain";
import { ElectionQueueManager } from "./ElectionQueueManager";

export class ElectionCommand {
  electionQueueManager: ElectionQueueManager;
  electionCache: ElectionCache;

  constructor(electionQueueManager: ElectionQueueManager, electionCache: ElectionCache) {
    this.electionQueueManager = electionQueueManager;
    this.electionCache = electionCache;
  }

  public async addElection(election: Election): Promise<void> {
    await this.electionCache.addElection(new ElectionInfo(election));
    return this.electionQueueManager.addElection(election);
  }

  public async addVoters(voters: Voter[], electionId: number): Promise<number> {
    return this.electionQueueManager.addVoters(voters, electionId);
  }
}
