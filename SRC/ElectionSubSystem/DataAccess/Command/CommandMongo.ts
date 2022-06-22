import mongoose from "mongoose";
import { model } from "mongoose";
import config from "config";
import {
  notificationSettingsSchema,
  INotificationSettings,
  NotificationSettings,
} from "../../Models/NotificationSettings";
import { Election, ElectionInfo } from "../../../Common/Domain";
import { electionInfoSchema } from "../../Models/ElectionInfoMongo";

export class CommandMongo {
  async addSettings(election: Election): Promise<void> {
    const modelNotificationSettings = model<INotificationSettings>(
      "NotificationSettings",
      notificationSettingsSchema
    );
    await mongoose.connect(
      `mongodb://${config.get("MONGO.host")}:${config.get(
        "MONGO.port"
      )}/${config.get("MONGO.dbName")}`
    );

    let electionSettings = new NotificationSettings(
      election.id,
      1,
      1,
      election.emails
    );

    await modelNotificationSettings.create(electionSettings);
  }

  async addElectionInfo(election: Election) : Promise<void>{
    const electionInfoModel = model<ElectionInfo>(
      "ElectionInfo",
      electionInfoSchema
    );
    await mongoose.connect(
      `mongodb://${config.get("MONGO.host")}:${config.get(
        "MONGO.port"
      )}/${config.get("MONGO.dbName")}`
    );

    let electionInfo : ElectionInfo = new ElectionInfo(election);

    await electionInfoModel.create(electionInfo);
  }

  async updateElectionInfo(electionId: number, voterCount : number) : Promise<void>{
    const electionInfoModel = model<ElectionInfo>(
      "ElectionInfo",
      electionInfoSchema
    );
    await mongoose.connect(
      `mongodb://${config.get("MONGO.host")}:${config.get(
        "MONGO.port"
      )}/${config.get("MONGO.dbName")}`
    );

    let electionInfo : ElectionInfo | null = await electionInfoModel.findOne({where:{id:electionId}});
    if(!electionInfo){
      throw new Error("ElectionInfo does not exit");
    }
    electionInfo.voterCount = voterCount;
    await electionInfoModel.updateOne({where:{id: electionId}}, electionInfo);
  }
}
