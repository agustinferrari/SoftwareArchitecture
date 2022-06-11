import { IFilter } from "../../Common/Validators/IFilter";
import { VoterQuery } from "../DataAccess/Query/VoteQuery";
import { VoteIntent } from "../Models/VoteIntent";

export class OneCandidateFilter implements IFilter {
  candidateCI: any;
  voteQuery: VoterQuery;
  key: any;
  error: string;
  maxAttempts: number;

  constructor(parameters: any, vote: VoteIntent, voteQuery: VoterQuery) {
    this.key = parameters["key"];
    this.error = parameters["errorMessage"];
    this.maxAttempts = parameters["maxAttempts"];
    this.voteQuery = voteQuery;
    const getKeyValue =
      <U extends keyof T, T extends object>(key: U) =>
      (obj: T) =>
        obj[key];

    this.candidateCI = getKeyValue<keyof VoteIntent, VoteIntent>(this.key)(vote);
  }

  validate() {
    const regEx = /^[1-9][0-9]*$/;
    if (!regEx.test(this.candidateCI)) {
      throw new Error(this.error);
    }
  }
}
