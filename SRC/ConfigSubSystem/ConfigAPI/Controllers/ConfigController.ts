import { Request, Response } from "express";
import { INotificationSettings} from "../Models/NotificationSettings";
import { NotificationSettingsRepository } from "../../DataAccess/Repositories/NotificationSettingsRepository";
import * as jwt from "jsonwebtoken";

export class ConfigController {

  static updateNotificationSettings = async (req: Request, res: Response) => {

    try{
  const notificationConfig : INotificationSettings = req.body;
  console.log(notificationConfig)
  await NotificationSettingsRepository.getNotificationSettingsRepository().updateNotificationSettings(notificationConfig);
  res.status(200).send("Notification settings updated: "+ notificationConfig.toString());
  }catch(err){
    res.status(400).send("Invalid request: Incorrect format. Format: {maxVotesPerVoter: number, maxVoteReportRequestsPerVoter: number, emailsSubscribed: string[]}");
    return;
  }

}


}
export default ConfigController;