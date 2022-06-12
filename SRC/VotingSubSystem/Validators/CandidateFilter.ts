import { Election, Vote } from "../../Common/Domain";
import { IFilter } from "../../Common/Validators/IFilter";
import { Query } from "../DataAccess/Query/Query";
import { VoteIntent } from "../Models/VoteIntent";

export class CandidateFilter implements IFilter {
  candidateCI: any;
  electionId: any;
  key1: any;
  key2: any;
  error: string;
  maxAttempts: number;
  voteQuery: Query;

  constructor(parameters: any, vote: Vote, voteQuery: Query) {
    this.key1 = parameters["key1"];
    this.key2 = parameters["key2"];
    this.error = parameters["errorMessage"];
    this.maxAttempts = parameters["maxAttempts"];
    this.voteQuery = voteQuery;
    const getKeyValue =
      <U extends keyof T, T extends object>(key: U) =>
      (obj: T) =>
        obj[key];

    this.candidateCI = getKeyValue<keyof Vote, Vote>(this.key1)(vote);
    this.electionId = getKeyValue<keyof Vote, Vote>(this.key2)(vote);
  }

  async validate() {
    let candidatesCIs: string[] = await this.voteQuery.getElectionCandidates(this.electionId);
    console.log(candidatesCIs);
    if (candidatesCIs.indexOf(this.candidateCI) === -1) {
      throw new Error(this.error);
    }
  }
}
