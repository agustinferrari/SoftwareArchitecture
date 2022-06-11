import { Voter } from "../Common/Domain";
import { Query } from "./DataAccess/Query/Query";
import config from "config";
import crypto from "crypto";
import { VoteIntent } from "./Models/VoteIntent";
import { VoteIntentEncrypted } from "./Models/VoteIntentEncrypted";
export class VoteEncryption {
  voterQuery: Query;

  public constructor(voterQuery: Query) {
    this.voterQuery = voterQuery;
  }
  public async decryptVote(voteEncrypted: VoteIntentEncrypted): Promise<VoteIntent> {
    let vote: string = voteEncrypted.data;
    let ci: string = voteEncrypted.voterCI;
    let voter: Voter = await this.voterQuery.getVoter(ci);
    let appEvPrivateKey: string = config.get("privateKey");
    let decryptedVote = crypto.privateDecrypt(appEvPrivateKey, Buffer.from(vote, "utf8"));

    let finalObj = crypto.publicDecrypt(voter.publicKey, decryptedVote).toString();
    let jsonObj = JSON.parse(finalObj);
    let finalVote: VoteIntent = new VoteIntent(ci, jsonObj.circuitId, jsonObj.electionId, jsonObj.candidateCI);
    return finalVote;
  }
}
