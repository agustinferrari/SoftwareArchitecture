import { QueryCache } from "../../../Common/Redis/QueryCache";
import { IUser } from "../../ConfigAPI/Models/User";
import { UserQuery } from "./UserQuery";

export class Query {
  static _instance: Query;
  queryCache: QueryCache;

  constructor() {
    this.queryCache = new QueryCache();
  }

  static getQuery(): Query {
    if (!Query._instance) {
      Query._instance = new Query();
    }
    return Query._instance;
  }

  async findByEmailOrFail(email: string): Promise<IUser> {
    return await UserQuery.findByEmailOrFail(email);
  }

  async existsElection(id: number): Promise<boolean> {
    return await this.queryCache.existsElection(id);
  }
}
