import mongoose from "mongoose";
import { model } from "mongoose";
import {
  INotificationSettings,
  notificationSettingsSchema
} from "../../ConfigAPI/Models/NotificationSettings";
import config from "config";

export class NotificationSettingsQuery {
  static async getNotificationSettings(electionId:number): Promise<INotificationSettings> {
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

    const notifSettings = await NotificationSettings.findOne({
      electionId: electionId
    }).exec()

    if(notifSettings){
        return notifSettings;
    }else{
        throw new Error("NotificationSettings not found");
    }
  }
}
