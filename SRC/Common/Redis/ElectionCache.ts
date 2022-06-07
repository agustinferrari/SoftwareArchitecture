import { json } from "stream/consumers";
import { ElectionInfo } from "../Domain";
import { RedisContext } from "./RedisContext";

export class ElectionCache {
  constructor(redisContext: RedisContext) {
    this.redisContext = redisContext;
  }
  redisContext: RedisContext;

  async addElection(electionModel: ElectionInfo): Promise<void> {
    this.redisContext.set(
      electionModel.id.toString(),
      JSON.stringify(electionModel)
    );
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
