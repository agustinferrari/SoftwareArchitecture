import mongoose from "mongoose";
import {model } from "mongoose";
import {INotificationSettings, notificationSettingsSchema } from "../../ConfigAPI/Models/NotificationSettings";
import {NotificationSettingsQuery} from "../Query/NotificationSettingsQuery";
import {NotificationSettingsCommand} from "../Command/NotificationSettingsCommand";
import {ElectionCache} from "../../../Common/Redis/ElectionCache";
import config from "config";
import { Election } from "../../../Common/Domain";


export class NotificationSettingsRepository {

  static _instance : NotificationSettingsRepository;

  static getNotificationSettingsRepository(): NotificationSettingsRepository{
    if(!NotificationSettingsRepository._instance){
      NotificationSettingsRepository._instance = new NotificationSettingsRepository();
    }
      return NotificationSettingsRepository._instance;
    
  }

   async updateNotificationSettings(
    newSettings: INotificationSettings
  ): Promise<void> {

    // if(ElectionCache.existsElection(newSettings.electionId)){
      NotificationSettingsCommand.findOneAndUpdate(newSettings);
    // }else{
    //   throw new Error("Election with id "+newSettings.electionId+ " not found");
    // }
   }

}
