import { VoteIntentEncrypted } from "./Models/VoteIntentEncrypted";
import { VoteIntent } from "./Models/VoteIntent";
import { VoteEncryption } from "./VoteEncryption";
import { Vote, ElectionInfo } from "../Common/Domain";
import { VoteCommand } from "./DataAccess/Command/VoteCommand";
import { Query } from "./DataAccess/Query/Query";

export class VotingService {
  //voteEncryption: VoteEncryption;
  voteCommand: VoteCommand;
  voteQuery: Query;

  constructor(/*voteEncryption: VoteEncryption,*/ voteCommand: VoteCommand, voteQuery: Query) {
    //this.voteEncryption = voteEncryption;
    this.voteCommand = voteCommand;
    this.voteQuery = voteQuery;
  }

  async handleVote(voteIntentEncrypted: VoteIntent): Promise<void> {
    let startTimestamp = new Date();
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
    this.addVote(voteIntent, startTimestamp);
    return;
    // send to bull
    // response
  }

  private async addVote(voteIntent: VoteIntent, startTimestamp: Date) {
    console.log("Entre a addVote");
    let endTimestamp = new Date();
    let vote = new Vote();
    vote.startTimestamp = startTimestamp;
    vote.endTimestamp = endTimestamp;
    vote.candidateCI = voteIntent.candidateCI;
    vote.voterCI = voteIntent.ci;
    vote.electionId = voteIntent.electionId;
    vote.responseTime = endTimestamp.getTime() - startTimestamp.getTime();
    let election: ElectionInfo = await this.voteQuery.getElection(vote.electionId);
    this.voteCommand.addVote(vote, election.mode);
    console.log("Termino addVote");
  }
}
