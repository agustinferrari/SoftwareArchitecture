import { ElectionCommandSQL } from "./ElectionCommandSQL";
import { ElectionCache } from "./../../../Common/Redis/ElectionCache";
import { Election, ElectionInfo, Voter } from "../../../Common/Domain";

export class ElectionCommand {
  electionCommandSQL: ElectionCommandSQL;
  electionCache: ElectionCache;

  constructor(
    electionCommandSQL: ElectionCommandSQL,
    electionCache: ElectionCache
  ) {
    this.electionCommandSQL = electionCommandSQL;
    this.electionCache = electionCache;
  }

  public async addElection(election: Election): Promise<void> {
    await this.electionCache.addElection(new ElectionInfo(election));
    return this.electionCommandSQL.addElection(election);
  }

  public async addVoters(voters: Voter[], idElection: number): Promise<number> {
    return this.electionCommandSQL.addVoters(voters, idElection);
  }
}
