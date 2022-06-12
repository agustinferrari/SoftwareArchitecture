import { INotificationSettings } from "../../ConfigAPI/Models/NotificationSettings";
import { NotificationSettingsCommand } from "../Command/NotificationSettingsCommand";
import { QueryCache } from "../../../Common/Redis/QueryCache";
import { CommandCache } from "../../../Common/Redis/CommandCache";
import { ElectionNotFound } from "../../ConfigAPI/Errors/ElectionNotFound";

export class NotificationSettingsRepository {
  static _instance: NotificationSettingsRepository;

  static getNotificationSettingsRepository(): NotificationSettingsRepository {
    if (!NotificationSettingsRepository._instance) {
      NotificationSettingsRepository._instance = new NotificationSettingsRepository();
    }
    return NotificationSettingsRepository._instance;
  }

  async updateNotificationSettings(
    newSettings: INotificationSettings
  ): Promise<INotificationSettings> {
    const cacheQuery = new QueryCache();
    const cacheCommand = new CommandCache();
    const exists = await cacheQuery.existsElection(newSettings.electionId);
    if (exists) {
      const updated = await NotificationSettingsCommand.findOneAndUpdate(newSettings);
      await cacheCommand.addNotificationSettings(updated);
      return updated;
    } else {
      throw new ElectionNotFound(newSettings.electionId);
    }
  }
}
