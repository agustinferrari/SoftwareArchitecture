import {ElectionCache} from "./../../../Common/Redis/ElectionCache";

export class ElectionQuery{
  electionCache: ElectionCache;

  constructor(electionCache: ElectionCache){
    this.electionCache = electionCache;
  }

  public existsElection(electionId:number): boolean{
    return this.electionCache.getElection(electionId) != null;
  }

}