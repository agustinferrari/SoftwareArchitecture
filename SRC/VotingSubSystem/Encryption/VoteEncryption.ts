import { Vote, Voter } from "../../Common/Domain";
import config from "config";
import crypto from "crypto";
import { VoteIntent } from "../VotingAPI/Models/VoteIntent";
import { VoteIntentEncrypted } from "../VotingAPI/Models/VoteIntentEncrypted";
export class VoteEncryption {

  public static async decryptVote(
    encrypted: VoteIntentEncrypted,
    voter: Voter
  ): Promise<Vote> {

    let privateKey: string = config.get("privateKey");
    let body = encrypted.data;
    let data = Buffer.from(body, "base64");
    let decrypted = crypto.privateDecrypt(privateKey, data);
    let decryptedVote = JSON.parse(decrypted.toString("utf8"));

    let signData = Buffer.from(JSON.stringify(decryptedVote.vote));
    let signature = Buffer.from(decryptedVote.signature, "base64");

    let verified = crypto.verify(
      "SHA256",
      signData,
      voter.publicKey,
      signature
    );

    if(!verified){
      throw new Error("Signature is not valid");
    }

    let decryptedData = decryptedVote.vote as VoteIntent;
    let vote = new Vote();
    vote.startTimestamp = new Date(decryptedData.startTimestamp);
    vote.candidateCI = decryptedData.candidateCI;
    vote.voterCI = encrypted.voterCI;
    vote.electionId = decryptedData.electionId;
    vote.circuitId = decryptedData.circuitId;
    return vote;
  }
}
