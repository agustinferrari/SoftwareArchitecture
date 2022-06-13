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
    this.error = "The election is not in progress";
    this.maxAttempts =1;
    this.voteQuery = voteQuery;
    this.startTimestamp = vote.startTimestamp;
    this.electionId = vote.electionId;
  }

  async validate() {
   let passValidation =  await this.voteQuery.validateVoteTime(this.startTimestamp, this.electionId);
   if(!passValidation){
    throw new Error(this.error);
   }
  }
}
