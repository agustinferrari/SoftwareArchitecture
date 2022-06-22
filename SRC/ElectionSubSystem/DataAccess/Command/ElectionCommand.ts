import { CommandCache } from "./../../../Common/Redis/CommandCache";
import { Election, ElectionInfo, Voter } from "../../../Common/Domain";
import { ElectionCommandQueue } from "./ElectionCommandQueue";
import { CommandMongo } from "./CommandMongo";

export class ElectionCommand {
  electionQueueManager: ElectionCommandQueue;
  electionCache: CommandCache;
  commandMongo: CommandMongo;

  constructor(
    electionQueueManager: ElectionCommandQueue,
    electionCache: CommandCache,
    commandMongo: CommandMongo
  ) {
    this.electionQueueManager = electionQueueManager;
    this.electionCache = electionCache;
    this.commandMongo = commandMongo;
  }

  public async addElection(election: Election): Promise<void> {
    await this.electionCache.addElection(new ElectionInfo(election));
    await this.commandMongo.addSettings(election);
    await this.commandMongo.addElectionInfo(election);
    return this.electionQueueManager.addElection(election);
  }

  public async addVoters(voters: Voter[], electionId: number): Promise<number> {
    return this.electionQueueManager.addVoters(voters, electionId);
  }

  public async addVoterCount(id: number, totalAdded: number): Promise<void> {
    await this.commandMongo.updateElectionInfo(id, totalAdded);
    this.electionCache.addVoterCount(id, totalAdded);
  }

  public async deleteVoterCandidateAssociation(
    electionId: number
  ): Promise<void> {
    return this.electionQueueManager.deleteVoterCandidateAssociation(
      electionId
    );
  }
}
