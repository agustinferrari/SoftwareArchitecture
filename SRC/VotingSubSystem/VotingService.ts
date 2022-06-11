import { VoteIntentEncrypted } from "./Models/VoteIntentEncrypted";
import { VoteIntent } from "./Models/VoteIntent";
import { VoteEncryption } from "./VoteEncryption";

export class VotingService {
  voteEncryption: VoteEncryption;

  constructor(voteEncryption: VoteEncryption) {
    this.voteEncryption = voteEncryption;
  }

  async handleVote(voteIntentEncrypted: VoteIntentEncrypted) {
    if (voteIntentEncrypted.ci == "1") {
      console.log("Vote for candidate 1");
    } else {
      throw new Error("Invalid candidate CI");
    }
    // console.log("Vote Encrypted: ", voteIntentEncrypted);
    // let voteIntent: VoteIntent = await this.voteEncryption.decryptVote(
    //   voteIntentEncrypted
    // );
    // console.log("VoteIntent: ", voteIntent);
    // voteIntent = encryptor.decrypt(voteIntentEncrypted.data);
    //try
    // validate(voteIntent)
    // send to bull
    // response
  }
}
