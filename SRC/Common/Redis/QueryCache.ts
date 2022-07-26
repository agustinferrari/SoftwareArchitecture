import { json } from "stream/consumers";
import { ElectionInfo } from "../Domain";
import { RedisContext } from "./RedisContext";
import config from "config";

export class QueryCache {
  constructor() {
    this.redisContext = RedisContext.getInstance();
  }
  redisContext: RedisContext;

  async getStatus(): Promise<boolean> {
    return this.redisContext.get(config.get("REDIS.statusKey")).then((result) => {
      return result === "true";
    });
  }

  async existsElection(id: number): Promise<boolean> {
    let exists = (await this.getElection(id)) != null;
    return exists;
  }

  getElection(id: number): Promise<ElectionInfo | null> {
    return this.redisContext.get(id.toString()).then((result) => {
      if (result) {
        const jsonObject = JSON.parse(result);
        let electionModel: ElectionInfo = new ElectionInfo(jsonObject);
        return electionModel;
      }
      return null;
    });
  }
}
