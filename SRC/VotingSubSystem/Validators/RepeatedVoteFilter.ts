import { Election, ElectionInfo, Vote } from "../../Common/Domain";
import { INotificationSender } from "../../Common/NotificationSender";
import { IFilter } from "../../Common/Validators/IFilter";
import { Query } from "../DataAccess/Query/Query";
import { NotificationHelper } from "../VotingAPI/Helpers/NotificationHelper";
import { VoteIntent } from "../VotingAPI/Models/VoteIntent";

export class RepeatedVoteFilter extends IFilter {
  voterCI: any;
  electionId: any;
  key1: any;
  key2: any;
  error: string;
  maxAttempts: number;
  voteQuery: Query;

  constructor(parameters: any, vote: Vote, voteQuery: Query) {
    super();
    this.key1 = parameters["key1"];
    this.key2 = parameters["key2"];
    this.error = parameters["errorMessage"];
    this.maxAttempts = parameters["maxAttempts"];
    this.voteQuery = voteQuery;
    const getKeyValue =
      <U extends keyof T, T extends object>(key: U) =>
      (obj: T) =>
        obj[key];

    this.voterCI = getKeyValue<keyof Vote, Vote>(this.key1)(vote);
    this.electionId = getKeyValue<keyof Vote, Vote>(this.key2)(vote);
  }

  async validate() {
    let isOverLimit = await this.voteQuery.checkRepeatedVote(this.voterCI, this.electionId);
    if(isOverLimit) {
      let electionInfo : ElectionInfo = await this.voteQuery.getElection(this.electionId);
      let alertSender : INotificationSender = NotificationHelper.getNotificationHelper().alertSender;
      alertSender.sendNotification(`${this.voterCI} ${this.electionId} ${this.error}`, electionInfo.emails);
      throw new Error(this.voterCI + " " + this.electionId + " " + this.error);
    }
  }
}
