import mongoose from "mongoose";
import { model } from "mongoose";
import config from "config";
import {
  notificationSettingsSchema,
  INotificationSettings,
} from "../../Models/NotificationSettings";

export class QueryMongo {
  static async getSettings(electionId: number): Promise<INotificationSettings> {
    const NotificationSettings = model<INotificationSettings>(
      "NotificationSettings",
      notificationSettingsSchema
    );
    await mongoose.connect(
      `mongodb://${config.get("MONGO.host")}:${config.get("MONGO.port")}/${config.get(
        "MONGO.dbName"
      )}`
    );

    const settings = await NotificationSettings.findOne({ electionId: electionId }).exec();

    if (settings) {
      return settings;
    } else {
      throw new Error("Settings not found");
    }

  }
}
