import { ElectionCommandSQL } from "./ElectionCommandSQL";
import { ElectionCache } from "./../../../Common/Redis/ElectionCache";
import { Election, Voter } from "../../../Common/Domain";

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
    return this.electionCommandSQL.addElection(election);
  }

  public async addVoters(
    voters: Voter[],
    idElection: number
  ): Promise<boolean> {
    return this.electionCommandSQL.addVoters(voters, idElection);
  }
}
