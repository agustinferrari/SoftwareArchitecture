import { Election, Vote } from "../../Common/Domain";
import { IFilter } from "../../Common/Validators/IFilter";
import { ElectionQuery } from "../DataAccess/Query/ElectionQuery";

export class ElectionVoteCountFilter extends IFilter {
  electionId: any;
  key: any;
  error: string;
  maxAttempts: number;
  electionQuery: ElectionQuery;

  constructor(parameters: any, election: Election) {
    super();
    this.key = parameters["key"];
    this.error = parameters["errorMessage"];
    this.maxAttempts = parameters["maxAttempts"];
    this.electionQuery = ElectionQuery.getInstance();
    const getKeyValue =
      <U extends keyof T, T extends object>(key: U) =>
      (obj: T) =>
        obj[key];

    this.electionId = getKeyValue<keyof Election, Election>(this.key)(election);
  }

  async validate() {
    let isValid = await this.electionQuery.validateElectionVotesCount(this.electionId);
    if (!isValid) {
      throw new Error(this.error);
    }
  }
}
