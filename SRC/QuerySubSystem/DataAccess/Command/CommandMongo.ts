import mongoose from "mongoose";
import { model } from "mongoose";
import config from "config";
import { IVoteProofLog, voteProofSchema } from "../../QueryAPI/Models/VoteProofLog";
import {
  INotificationSettings,
  notificationSettingsSchema,
} from "./../../QueryAPI/Models/NotificationSettings";

export class CommandMongo {

  static async AddVoteProofLog(
    voterCI: string,
    timestamp: Date,
    electionId: number,
    wasRejected: boolean
  ): Promise<void> {
    const VoteProofLog = model<IVoteProofLog>("VoteProofLoog", voteProofSchema);

    await mongoose.connect(
      `mongodb://${config.get("MONGO.host")}:${config.get("MONGO.port")}/${config.get(
        "MONGO.dbName"
      )}`
    );

    const voteProofLog = new VoteProofLog({
      voterCI: voterCI,
      timestamp: timestamp,
      electionId: electionId,
      statusRejected: wasRejected,
    });
    await voteProofLog.save();
    console.log(
      "VoteProof Log " +
        voterCI +
        " " +
        timestamp +
        " " +
        electionId +
        " with statusRejected " +
        wasRejected +
        " saved to database"
    );

    return;
  }

  static async findOneSettingsAndUpdate(
    settings: INotificationSettings
  ): Promise<INotificationSettings> {
    await mongoose.connect(
      `mongodb://192.168.0.106:${config.get("MONGO.port")}/${config.get("MONGO.dbName")}`
    );

    const NotificationSettings = model<INotificationSettings>(
      "NotificationSettings",
      notificationSettingsSchema,
      "NotificationSettings"
    );

    const filter = { electionId: settings.electionId };
    const update = {
      maxVotesPerVoter: settings.maxVotesPerVoter,
      maxVoteReportRequestsPerVoter: settings.maxVoteReportRequestsPerVoter,
      emailsSubscribed: settings.emailsSubscribed,
    };

    const notifSettings = await NotificationSettings.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true,
    }).exec();
    return notifSettings;
  }
}
