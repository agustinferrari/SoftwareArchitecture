import { ElectionInfo, INotificationSettings } from "../Domain";
import { RedisContext } from "./RedisContext";
import config from "config";

export class CacheCommand {
  constructor() {
    this.redisContext = RedisContext.getInstance();
  }
  redisContext: RedisContext;

  async setStatus(): Promise<void> {
    return this.redisContext.set(config.get("REDIS.statusKey"), "true");
  }

  async addElection(electionModel: ElectionInfo): Promise<void> {
    this.redisContext.set(electionModel.id.toString(), JSON.stringify(electionModel));
  }

  async addNotificationSettings(settings: INotificationSettings): Promise<void> {
    let electionString: string | null = await this.redisContext.get(settings.electionId.toString());
    if (electionString != null) {
      const election: ElectionInfo = JSON.parse(electionString);
      election.maxVoteRecordRequestsPerVoter = settings.maxVoteReportRequestsPerVoter;
      election.maxVotesPerVoter = settings.maxVotesPerVoter;
      election.emails = settings.emailsSubscribed;
      this.redisContext.set(settings.electionId.toString(), JSON.stringify(election));
    }
  }
}
