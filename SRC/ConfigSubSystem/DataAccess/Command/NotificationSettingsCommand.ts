import {
  INotificationSettings,
  notificationSettingsSchema,
} from "../../ConfigAPI/Models/NotificationSettings";

import config from "config";
import mongoose from "mongoose";
import { model } from "mongoose";

export class NotificationSettingsCommand {
  static async addSettings(settings: INotificationSettings) {
    await mongoose.connect(
      `mongodb://localhost:${config.get("MONGO.port")}/${config.get(
        "MONGO.dbName"
      )}`
    );

    const NotificationSettings = model<INotificationSettings>(
      "NotificationSettings",
      notificationSettingsSchema,
      "NotificationSettings"
    );

    const newSettings = new NotificationSettings({
      electionId: settings.electionId,
      emailsSubscribed: settings.emailsSubscribed,
      maxVoteReportRequestsPerVoter: settings.maxVoteReportRequestsPerVoter,
      maxVotesPerVoter: settings.maxVotesPerVoter,
    });
    await newSettings.save();
    console.log(
      "Settings for election: " + settings.electionId + " saved to database"
    );

    return;
  }

  static async findOneAndUpdate(settings: INotificationSettings) : Promise<INotificationSettings> {
    await mongoose.connect(
      `mongodb://localhost:${config.get("MONGO.port")}/${config.get(
        "MONGO.dbName"
      )}`
    );

    const NotificationSettings = model<INotificationSettings>(
      "NotificationSettings",
      notificationSettingsSchema,
      "NotificationSettings"
    );

    const filter = {electionId: settings.electionId};
    const update = {maxVotesPerVoter: settings.maxVotesPerVoter, maxVoteReportRequestsPerVoter: settings.maxVoteReportRequestsPerVoter, emailsSubscribed: settings.emailsSubscribed};

    const notifSettings = await NotificationSettings.findOneAndUpdate(filter,update,{new: true,upsert:true}).exec();
    return notifSettings;
  }
}
