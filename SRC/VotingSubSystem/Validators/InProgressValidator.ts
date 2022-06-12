import { Vote } from "../../Common/Domain";
import { IFilter } from "../../Common/Validators/IFilter";
import { Query } from "../DataAccess/Query/Query";

export class InProgressValidator implements IFilter {
  startTimestamp: any;
  electionId: any;
  error: string;
  maxAttempts: number;
  voteQuery: Query;

  constructor(parameters: any, vote: Vote, voteQuery: Query) {
    this.error = parameters["errorMessage"];
    this.maxAttempts = parameters["maxAttempts"];
    this.voteQuery = voteQuery;
    const getKeyValue =
      <U extends keyof T, T extends object>(key: U) =>
      (obj: T) =>
        obj[key];

    this.startTimestamp = vote.startTimestamp;
    this.electionId = vote.electionId;
  }

  async validate() {
    await this.voteQuery.validateVoteTime(this.startTimestamp, this.electionId);
  }
}
