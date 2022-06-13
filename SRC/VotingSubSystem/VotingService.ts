import { VoteIntentEncrypted } from "./Models/VoteIntentEncrypted";
import { VoteIntent } from "./Models/VoteIntent";
import { VoteEncryption } from "./VoteEncryption";
import { Vote, ElectionInfo } from "../Common/Domain";
import { VoteCommand } from "./DataAccess/Command/VoteCommand";
import { Query } from "./DataAccess/Query/Query";
import { ValidatorManager } from "./Validators/ValidatorManager";

export class VotingService {
  //voteEncryption: VoteEncryption;
  voteCommand: VoteCommand;
  voteQuery: Query;
  validatorManager: ValidatorManager;

  constructor(/*voteEncryption: VoteEncryption,*/ voteCommand: VoteCommand, voteQuery: Query) {
    //this.voteEncryption = voteEncryption;
    this.voteCommand = voteCommand;
    this.voteQuery = voteQuery;
    this.validatorManager = new ValidatorManager(voteQuery);
  }

  async handleVote(voteIntentEncrypted: VoteIntent): Promise<void> {
    // console.log("Incoming vote: " + JSON.stringify(voteIntentEncrypted));
    let startTimestamp = new Date();

    let vote = new Vote();
    vote.startTimestamp = voteIntentEncrypted.startTimestamp;
    vote.candidateCI = voteIntentEncrypted.candidateCI;
    vote.voterCI = voteIntentEncrypted.voterCI;
    vote.electionId = voteIntentEncrypted.electionId;
    vote.circuitId = voteIntentEncrypted.circuitId;
    // console.log("Vote Encrypted: ", voteIntentEncrypted);
    // let voteIntent: VoteIntent = await this.voteEncryption.decryptVote(
    //   voteIntentEncrypted
    // );
    // console.log("VoteIntent: ", voteIntent);
    // voteIntent = encryptor.decrypt(voteIntentEncrypted.data);
    //try

    //TODO: Replace with decrypted
    let voteIntent: VoteIntent = voteIntentEncrypted;
    // voteIntent = await this.voteEncryption.decryptVote(voteIntentEncrypted);

    //validate(voteIntent)
    this.validatorManager.createPipeline(vote, "vote");
    this.validatorManager.validate();
    let endTimestamp = new Date();
    vote.endTimestamp = endTimestamp;
    this.addVote(vote, startTimestamp);
    return;
    // send to bull
    // response
  }

  private async addVote(vote: Vote, startTimestamp: Date) {
    vote.responseTime = vote.endTimestamp.getTime() - vote.startTimestamp.getTime();
    let election: ElectionInfo = await this.voteQuery.getElection(vote.electionId);
    this.voteCommand.addVote(vote, election.mode);

    // let endTimestamp = new Date();
    // let vote = new Vote();
    // vote.startTimestamp = startTimestamp;
    // vote.endTimestamp = endTimestamp;
    // vote.candidateCI = voteIntent.candidateCI;
    // vote.voterCI = voteIntent.voterCI;
    // vote.electionId = voteIntent.electionId;
    // vote.responseTime = endTimestamp.getTime() - startTimestamp.getTime();
    // let election: ElectionInfo = await this.voteQuery.getElection(vote.electionId);
    // this.voteCommand.addVote(vote, election.mode);
    console.log("Termino addVote");
  }
}
