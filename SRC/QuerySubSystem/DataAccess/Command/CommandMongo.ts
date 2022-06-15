import mongoose from "mongoose";
import { model } from "mongoose";
import { IUser, userSchema } from "../../QueryAPI/Models/User";
import config from "config";
import { IVoteProofLog, voteProofSchema } from "../../QueryAPI/Models/VoteProofLog";
import {
  INotificationSettings,
  notificationSettingsSchema,
} from "./../../QueryAPI/Models/NotificationSettings";

export class CommandMongo {
  static async addUser(email: string, password: string, role: string): Promise<void> {
    const User = model<IUser>("User", userSchema);

    await mongoose.connect(
      `mongodb://${config.get("MONGO.host")}:${config.get("MONGO.port")}/${config.get(
        "MONGO.dbName"
      )}`
    );

    const user = new User({
      email: email,
      password: password,
      role: role,
    });
    await user.save();
    console.log("User " + email + " saved to database");

    return;
  }

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
      `mongodb://localhost:${config.get("MONGO.port")}/${config.get("MONGO.dbName")}`
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
