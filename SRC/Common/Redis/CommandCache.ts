import { json } from "stream/consumers";
import { ElectionInfo } from "../Domain";
import { RedisContext } from "./RedisContext";
import config from "config";

export class CommandCache {
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
}
