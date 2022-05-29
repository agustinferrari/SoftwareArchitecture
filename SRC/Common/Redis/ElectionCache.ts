import { json } from "stream/consumers";
import { ElectionModel } from "./ElectionModel";
import { RedisContext } from "./RedisContext";

export class ElectionCache {
  constructor(redisContext: RedisContext) {
    this.redisContext = redisContext;
  }
  redisContext: RedisContext;

  addElection(electionModel: ElectionModel) {
    this.redisContext.set(
      electionModel.id.toString(),
      JSON.stringify(electionModel)
    );
  }

  getElection(id: number): Promise<ElectionModel | null> {
    return this.redisContext.get(id.toString()).then((result) => {
      if (result) {
        const jsonObject = JSON.parse(result);
        let electionModel: ElectionModel = new ElectionModel(jsonObject);
        return electionModel;
      }
      return null;
    });
  }
}
