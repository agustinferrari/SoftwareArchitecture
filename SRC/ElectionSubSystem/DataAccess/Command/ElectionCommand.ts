import { ElectionCommandSQL } from "./ElectionCommandSQL";
import {ElectionCache} from "./../../../Common/Redis/ElectionCache";
import {ElectionDTO, VoterDTO} from "../../../Common/Domain";

export class ElectionCommand{
  electionCommandSQL : ElectionCommandSQL;
  electionCache: ElectionCache;

  constructor(electionCommandSQL: ElectionCommandSQL, electionCache: ElectionCache){
    this.electionCommandSQL = electionCommandSQL;
    this.electionCache = electionCache;
  }

  public addElection(election: ElectionDTO): void{
    this.electionCommandSQL.addElection(election);
  }

  public addVoters(voters: VoterDTO[], idElection: number): void{
    this.electionCommandSQL.addVoters(voters, idElection);
  }

}