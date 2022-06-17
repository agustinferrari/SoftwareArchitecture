import mongoose from "mongoose";
import { model } from "mongoose";
import config from "config";
import { IVoteProofLog, voteProofSchema } from "../../QueryAPI/Models/VoteProofLog";

export class QueryMongo {
  static async getVoteProofLogCount(voterCI: string, electionId:number): Promise<number> {
    const VoteProofLog = model<IVoteProofLog>("VoteProofLog", voteProofSchema);
    await mongoose.connect(
      `mongodb://${config.get("MONGO.host")}:${config.get("MONGO.port")}/${config.get(
        "MONGO.dbName"
      )}`
    );
    const count = await VoteProofLog.count(
      { 
        voterCI: voterCI,
        electionId: electionId 
      }
    ).exec();

    return count;
  }
}
