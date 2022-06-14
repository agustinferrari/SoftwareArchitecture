import { CommandCache } from "../../../Common/Redis/CommandCache";
import { INotificationSettings } from "../../ConfigAPI/Models/NotificationSettings";
import { IUser } from "../../ConfigAPI/Models/User";
import { UserCommand } from "./UserCommand";
import { Query } from "../Query/Query"
import { NotificationSettingsCommand } from "./NotificationSettingsCommand";
import { ElectionNotFound } from "../../ConfigAPI/Errors/ElectionNotFound";

export class Command {
  static _instance: Command;
  commandCache: CommandCache;

  constructor() {
    this.commandCache = new CommandCache();
  }

  static getCommand(): Command {
    if (!Command._instance) {
        Command._instance = new Command();
    }
    return Command._instance;
  }

  async updateNotificationSettings(
    newSettings: INotificationSettings
  ): Promise<INotificationSettings> {

        const cacheCommand = new CommandCache();
        const query = Query.getQuery()
    const exists = await query.existsElection(newSettings.electionId);
    if (exists) {
      const updated = await NotificationSettingsCommand.findOneAndUpdate(newSettings);
      await cacheCommand.addNotificationSettings(updated);
      return updated;
    } else {
      throw new ElectionNotFound(newSettings.electionId);
    }
  }
}
