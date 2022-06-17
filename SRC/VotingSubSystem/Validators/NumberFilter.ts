import { Vote } from "../../Common/Domain";
import { IFilter } from "../../Common/Validators/IFilter";
import { Query } from "../DataAccess/Query/Query";

export class NumberFilter extends IFilter {
  candidateCI: any;
  voteQuery: Query;
  key: any;
  error: string;
  maxAttempts: number;

  constructor(parameters: any, vote: Vote, voteQuery: Query) {
    super();
    this.key = parameters["key"];
    this.error = parameters["errorMessage"];
    this.maxAttempts = parameters["maxAttempts"];
    this.voteQuery = voteQuery;
    const getKeyValue =
      <U extends keyof T, T extends object>(key: U) =>
      (obj: T) =>
        obj[key];

    this.candidateCI = getKeyValue<keyof Vote, Vote>(this.key)(vote);
  }

  async validate() {
    const regEx = /^[1-9][0-9]*$/;
    if (!regEx.test(this.candidateCI)) {
      throw new Error(this.error);
    }
  }
}
