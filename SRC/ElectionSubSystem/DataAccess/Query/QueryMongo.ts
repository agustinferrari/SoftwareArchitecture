import mongoose from "mongoose";
import { model } from "mongoose";
import config from "config";
import {
  notificationSettingsSchema,
  INotificationSettings,
} from "../../Models/NotificationSettings";
import { Election, ElectionInfo } from "../../../Common/Domain";
import { electionInfoSchema } from "../../Models/ElectionInfoMongo";

export class QueryMongo {
  static async getSettings(electionId: number): Promise<INotificationSettings> {
    const NotificationSettings = model<INotificationSettings>(
      "NotificationSettings",
      notificationSettingsSchema
    );
    await mongoose.connect(
      `mongodb://${config.get("MONGO.host")}:${config.get(
        "MONGO.port"
      )}/${config.get("MONGO.dbName")}`
    );

    const settings = await NotificationSettings.findOne({
      electionId: electionId,
    }).exec();

    if (settings) {
      return settings;
    } else {
      throw new Error("Settings not found");
    }
  }

  static async getElectionInfos(): Promise<ElectionInfo[]> {
    const electionInfoModel = model<ElectionInfo>(
      "ElectionInfo",
      electionInfoSchema
    );
    await mongoose.connect(
      `mongodb://${config.get("MONGO.host")}:${config.get(
        "MONGO.port"
      )}/${config.get("MONGO.dbName")}`
    );

    let found = await electionInfoModel.find().exec();

    let result: ElectionInfo[] = [];

    found.forEach(element => {
      let electionInfo  : ElectionInfo = new ElectionInfo(element);
      result.push(electionInfo);
    });

    return result;
  }
}
