import { CommandCache } from "./../../../Common/Redis/CommandCache";
import { Election, ElectionInfo, Voter } from "../../../Common/Domain";
import { ElectionCommandQueue } from "./ElectionCommandQueue";

export class ElectionCommand {
  electionQueueManager: ElectionCommandQueue;
  electionCache: CommandCache;

  constructor(electionQueueManager: ElectionCommandQueue, electionCache: CommandCache) {
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
