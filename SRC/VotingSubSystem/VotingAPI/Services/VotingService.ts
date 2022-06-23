import { VoteIntentEncrypted } from "../Models/VoteIntentEncrypted";
import { VoteEncryption } from "../../Encryption/VoteEncryption";
import { Vote, ElectionInfo, Voter, VoteProof } from "../../../Common/Domain";
import { VoteCommand } from "../../DataAccess/Command/VoteCommand";
import { Query } from "../../DataAccess/Query/Query";
import { ValidatorManager } from "../../Validators/ValidatorManager";
import { INotificationSender } from "../../../Common/NotificationSender";
import { RequestCountHelper } from "../../Helpers/RequestCountHelper";
import { LoggerFacade } from "../../Logger/LoggerFacade";
import { DuplicateBullIdError } from "../Errors/DuplicateBullIdError";

export class VotingService {
  voteCommand: VoteCommand;
  voteQuery: Query;
  validatorManager: ValidatorManager;
  notificationSender: INotificationSender;
  loggerFacade: LoggerFacade;

  constructor(voteCommand: VoteCommand, voteQuery: Query, voteProofSender: INotificationSender) {
    this.voteCommand = voteCommand;
    this.voteQuery = voteQuery;
    this.notificationSender = voteProofSender;
    this.validatorManager = new ValidatorManager(voteQuery);
    this.loggerFacade = new LoggerFacade();
  }

  async handleVote(voteIntentEncrypted: VoteIntentEncrypted): Promise<void> {
    let reqCountHelper = RequestCountHelper.getInstance();

    let receptionTimestamp = new Date(); 
    reqCountHelper.beforeGetVoter++;

    let voter: Voter = await this.voteQuery.getVoter(voteIntentEncrypted.voterCI);

    reqCountHelper.beforeEncryptionCount++;
    let vote: Vote = new Vote();
    try {
      vote = await VoteEncryption.decryptVote(voteIntentEncrypted, voter);
    } catch (error: any) {
      this.notificationSender.sendNotification(`Could not decrypt vote:\n${error.message}`, [
        voter.phone,
      ]);
      this.loggerFacade.logUnauthorizedAccess(
        `Decrypting vote issue for ci ${voter.ci}: ${error.message}`,
        "/votes"
      );
      return;
    }

    reqCountHelper.beforeValidationCount++;
    let pipeline = this.validatorManager.createPipeline(vote, "vote");
    try {
      await this.validatorManager.validate(pipeline);
    } catch (error: any) {
      this.notificationSender.sendNotification(`Could not validate vote:\n${error.message}`, [
        voter.phone,
      ]);
      this.loggerFacade.logBadRequest(
        `Voting validation issue for ci ${voter.ci}: ${error.message}`,
        "/votes"
      );
      return;
    }

    reqCountHelper.afterValidationCount++;
    this.afterValidation(vote, voter, receptionTimestamp);
    return;
  }

  private async afterValidation(vote: Vote, voter: Voter, receptionTimestamp: Date) {
    let election: ElectionInfo = await this.voteQuery.getElection(vote.electionId);
    vote.randomizeAndSetId();
    let reqCountHelper = RequestCountHelper.getInstance();

    reqCountHelper.beforeAddVoteCount++;
    try{
      await this.addVote(vote, election, receptionTimestamp);
      reqCountHelper.afterAddVoteCount++;
      this.sendVoteProof(vote, voter, election);
    }catch(e:any){
      if(e instanceof DuplicateBullIdError){
        this.notificationSender.sendNotification(e.message, [voter.phone]);
      }
    }
  }

  private async addVote(vote: Vote, election: ElectionInfo, startTimestamp: Date) {
    let endTimestamp = new Date();
    let responseTime = endTimestamp.valueOf() - startTimestamp.valueOf();
    let resultingEndTimestamp = new Date(responseTime + vote.startTimestamp.valueOf());
    vote.responseTime = responseTime;
    vote.endTimestamp= resultingEndTimestamp;

    return this.voteCommand.addVote(vote, election.mode);
  }

  private sendVoteProof(vote: Vote, voter: Voter, election: ElectionInfo) {
    let voteProof: VoteProof = new VoteProof(vote, voter, election);
    let message = voteProof.ToString();
    let phoneNumbers: string[] = [voter.phone];
    this.notificationSender.sendNotification(message, phoneNumbers);
  }
}
