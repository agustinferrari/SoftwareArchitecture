import { VoteIntentEncrypted } from "./Models/VoteIntentEncrypted";
import { VoteIntent } from "./Models/VoteIntent";
import { VoteEncryption } from "./VoteEncryption";
import { Vote, ElectionInfo, Voter, VoteProof } from "../Common/Domain";
import { VoteCommand } from "./DataAccess/Command/VoteCommand";
import { Query } from "./DataAccess/Query/Query";
import { ValidatorManager } from "./Validators/ValidatorManager";
import { INotificationSender } from "../Common/NotificationSender";
import { TimeoutError } from "./Error/TimeOutError";

export class VotingService {
  //voteEncryption: VoteEncryption;
  voteCommand: VoteCommand;
  voteQuery: Query;
  validatorManager: ValidatorManager;
  voteProofSender : INotificationSender;
  constructor(/*voteEncryption: VoteEncryption,*/ voteCommand: VoteCommand, voteQuery: Query, voteProofSender: INotificationSender) {
    //this.voteEncryption = voteEncryption;
    this.voteCommand = voteCommand;
    this.voteQuery = voteQuery;
    this.voteProofSender = voteProofSender;
    this.validatorManager = new ValidatorManager(voteQuery);
  }

  async handleVote(voteIntentEncrypted: VoteIntentEncrypted): Promise<void> {
    let startTimestamp = new Date();
    let voter : Voter = await this.voteQuery.getVoter(voteIntentEncrypted.voterCI);
    
    let vote = await VoteEncryption.decryptVote(voteIntentEncrypted, voter);
    
    await this.validatorManager.createPipeline(vote, "vote");
    await this.validatorManager.validate();

    let endTimestamp = new Date();
    vote.endTimestamp = endTimestamp;

    let responseTime = endTimestamp.valueOf() - vote.startTimestamp.valueOf();
    
    if (responseTime > 2000) {
      throw new TimeoutError();
    }

    this.afterValidation(vote, voter, startTimestamp);
    return;
  }

  private async afterValidation(vote: Vote, voter: Voter, startTimestamp :Date){
    let election: ElectionInfo = await this.voteQuery.getElection(vote.electionId);
    vote.randomizeAndSetId();
    this.addVote(vote, election, startTimestamp);
    this.sendVoteProof(vote, voter, election);
  }

  private async addVote(vote: Vote, election :ElectionInfo, startTimestamp: Date) {
    let responseTime = vote.endTimestamp.valueOf() - startTimestamp.valueOf();
    vote.responseTime = responseTime;

    this.voteCommand.addVote(vote, election.mode);
  }

  private sendVoteProof(vote: Vote, voter: Voter, election : ElectionInfo){
    let voteProof : VoteProof = new VoteProof(vote,voter,election);
    let message = voteProof.ToString();
    let phoneNumbers : string[]= [voter.phone];
    this.voteProofSender.sendNotification(message,phoneNumbers);
  }
}
