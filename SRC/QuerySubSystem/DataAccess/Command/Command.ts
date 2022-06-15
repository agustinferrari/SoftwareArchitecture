import { CommandMongo } from "./CommandMongo";
import { INotificationSettings } from "./../../QueryAPI/Models/NotificationSettings";
import { QueryCache } from "../../../Common/Redis/QueryCache";
import { CommandCache } from "../../../Common/Redis/CommandCache";
import { ElectionNotFound } from "../../QueryAPI/Errors/ElectionNotFound";

export class Command {
  static _instance: Command;
  commandCache: CommandCache;
  queryCache: QueryCache;

  constructor() {
    this.commandCache = new CommandCache();
    this.queryCache = new QueryCache();
  }

  static getCommand(): Command {
    if (!Command._instance) {
      Command._instance = new Command();
    }
    return Command._instance;
  }

  async AddVoteProofLog(
    voterCI: string,
    timestamp: Date,
    electionId: number,
    wasRejected: boolean
  ): Promise<void> {
    return await CommandMongo.AddVoteProofLog(voterCI, timestamp, electionId, wasRejected);
  }

  async updateNotificationSettings(
    newSettings: INotificationSettings
  ): Promise<INotificationSettings> {
    const cacheQuery = new QueryCache();
    const cacheCommand = new CommandCache();
    const exists = await cacheQuery.existsElection(newSettings.electionId);

    if (exists) {
      const updated = await CommandMongo.findOneSettingsAndUpdate(newSettings);
      await cacheCommand.addNotificationSettings(updated);
      return updated;
    } else {
      throw new ElectionNotFound(newSettings.electionId);
    }
  }
}
