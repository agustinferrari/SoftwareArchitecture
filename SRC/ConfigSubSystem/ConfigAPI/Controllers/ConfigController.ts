import { Request, Response } from "express";
import { INotificationSettings } from "../Models/NotificationSettings";
import { NotificationSettingsRepository } from "../../DataAccess/Repositories/NotificationSettingsRepository";
import { ElectionNotFound } from "../Errors/ElectionNotFound";

export class ConfigController {
  static updateNotificationSettings = async (req: Request, res: Response) => {
    try {
      const settings: INotificationSettings = req.body;
      const updated =
        await NotificationSettingsRepository.getNotificationSettingsRepository().updateNotificationSettings(
          settings
        );
      res
        .status(200)
        .send(
          "Notification settings for election " +
            settings.electionId +
            " updated: " +
            JSON.stringify(updated)
        );
    } catch (error: any) {
      if (error instanceof ElectionNotFound) {
        res.status(404).send(error.message);
      } else {
        res
          .status(400)
          .send(
            "Invalid request: Incorrect format. Format: {maxVotesPerVoter: number, maxVoteReportRequestsPerVoter: number, emailsSubscribed: string[]}"
          );
      }
      return;
    }
  };
}
export default ConfigController;
// "Invalid request: Incorrect format. Format: {maxVotesPerVoter: number, maxVoteReportRequestsPerVoter: number, emailsSubscribed: string[]}"
