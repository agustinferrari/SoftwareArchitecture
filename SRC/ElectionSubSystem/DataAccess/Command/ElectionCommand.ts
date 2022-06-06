import { ElectionCommandSQL } from "./ElectionCommandSQL";
import { ElectionCache } from "./../../../Common/Redis/ElectionCache";
import { ElectionDTO, VoterDTO } from "../../../Common/Domain";

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

  public async addElection(election: ElectionDTO): Promise<void> {
    return this.electionCommandSQL.addElection(election);
  }

  public async addVoters(
    voters: VoterDTO[],
    idElection: number
  ): Promise<void> {
    this.electionCommandSQL.addVoters(voters, idElection);
  }
}
