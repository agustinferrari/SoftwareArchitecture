import { IEncryption } from "../Encryption";
import { VoteInfo, Voter } from "../Common/Domain";
import { VoterQuery } from "./DataAccess/Query/VoteQuery";
import config from "config";
import crypto from "crypto";
export class VoteEncryption {
  voterQuery: VoterQuery;

  public constructor( voterQuery: VoterQuery) {
    this.voterQuery = voterQuery;
  }
  public async decryptVote(vote: string, ci: string): Promise<VoteInfo> {
    let voter: Voter = await this.voterQuery.getVoter(ci);
    let appEvPrivateKey: string = config.get("privateKey");
    let decryptedVote = crypto.privateDecrypt( appEvPrivateKey, Buffer.from(vote, "utf8"));

    let finalObj = crypto.publicDecrypt(voter.publicKey, decryptedVote).toString();
    let finalVote : VoteInfo = JSON.parse(finalObj);
    return finalVote;
  }
}
