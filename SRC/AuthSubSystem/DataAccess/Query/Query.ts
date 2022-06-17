import { QueryMongo } from "./QueryMongo";
import { QueryCache } from "../../../Common/Redis/QueryCache";
import { IUser } from "../../QueryAPI/Models/User";

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

  public async findByEmailOrFail(email: string): Promise<IUser> {
    return await QueryMongo.findByEmailOrFail(email);
  }
  // async addUser(email: string, password: string, role: string): Promise<void> {
  //   await UserCommand.addUser(email, password, role);

  //   return;
  // }
}
