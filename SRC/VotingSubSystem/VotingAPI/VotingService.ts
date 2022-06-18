import { VoteIntentEncrypted } from "./Models/VoteIntentEncrypted";
import { VoteIntent } from "./Models/VoteIntent";
import { VoteEncryption } from "../VoteEncryption";
import { Vote, ElectionInfo, Voter, VoteProof } from "../../Common/Domain";
import { VoteCommand } from "../DataAccess/Command/VoteCommand";
import { Query } from "../DataAccess/Query/Query";
import { ValidatorManager } from "../Validators/ValidatorManager";
import { INotificationSender } from "../../Common/NotificationSender";
import { TimeoutError } from "./Error/TimeOutError";
import { RequestStatus } from "./Models/RequestStatus";
import { RequestCountHelper } from "../RequestCountHelper";
import { LoggerFacade } from "../Logger/LoggerFacade";
import config from "config";
export class VotingService {
  voteCommand: VoteCommand;
  voteQuery: Query;
  validatorManager: ValidatorManager;
  voteProofSender : INotificationSender;
  loggerFacade: LoggerFacade;
  constructor(voteCommand: VoteCommand, voteQuery: Query, voteProofSender: INotificationSender) {
    this.voteCommand = voteCommand;
    this.voteQuery = voteQuery;
    this.voteProofSender = voteProofSender;
    this.validatorManager = new ValidatorManager(voteQuery);
    this.loggerFacade = new LoggerFacade();
  }

  async handleVote(voteIntentEncrypted: VoteIntentEncrypted): Promise<void> {
    let reqCountHelper = RequestCountHelper.getInstance();


    let startTimestamp = new Date();
    reqCountHelper.beforeGetVoter++;
    
    let voter : Voter = await this.voteQuery.getVoter(voteIntentEncrypted.voterCI);
    
    reqCountHelper.beforeEncryptionCount++;
    let vote = await VoteEncryption.decryptVote(voteIntentEncrypted, voter);
    
    reqCountHelper.beforeValidationCount++;
    await this.validatorManager.createPipeline(vote, "vote");
    await this.validatorManager.validate();

    let endTimestamp = new Date();
    vote.endTimestamp = endTimestamp;

    let responseTime = endTimestamp.valueOf() - vote.startTimestamp.valueOf();

    let timeout :number= config.get("VOTING_API.timeout");
    if (responseTime > timeout) {
      let message = `Timeout on vote for ci ${vote.voterCI} and election ${vote.electionId}`;
      this.loggerFacade.logServerError(message, "/votes");
      throw new TimeoutError();
    }

    reqCountHelper.afterValidationCount++;
    this.afterValidation(vote, voter, startTimestamp);
    return;
  }

  private async afterValidation(vote: Vote, voter: Voter, startTimestamp :Date){
    let election: ElectionInfo = await this.voteQuery.getElection(vote.electionId);
    vote.randomizeAndSetId();
    let reqCountHelper = RequestCountHelper.getInstance();

    reqCountHelper.beforeAddVoteCount++;
    await this.addVote(vote, election, startTimestamp);
    reqCountHelper.afterAddVoteCount++;
    this.sendVoteProof(vote, voter, election);
  }

  private async addVote(vote: Vote, election :ElectionInfo, startTimestamp: Date) {
    let responseTime = vote.endTimestamp.valueOf() - startTimestamp.valueOf();
    vote.responseTime = responseTime;

    return this.voteCommand.addVote(vote, election.mode);
  }

  private sendVoteProof(vote: Vote, voter: Voter, election : ElectionInfo){
    let voteProof : VoteProof = new VoteProof(vote,voter,election);
    let message = voteProof.ToString();
    let phoneNumbers : string[]= [voter.phone];
    this.voteProofSender.sendNotification(message,phoneNumbers);
  }
}
