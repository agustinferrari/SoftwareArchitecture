import { UserCommand } from "../Command/UserCommand";
import { UserQuery } from "../Query/UserQuery";
import { IUser } from "../../ConfigAPI/Models/User";


export class UserRepository {
  static _instance: UserRepository;

  static getUserRepository(): UserRepository {
    if (!UserRepository._instance) {
      UserRepository._instance = new UserRepository();
    }
    return UserRepository._instance;
  }

  async addUser(email: string, password: string, role: string): Promise<void> {
    await UserCommand.addUser(email, password, role);

    return;
  }

  //find user by email
  async findByEmailOrFail(email: string): Promise<IUser> {
    return await UserQuery.findByEmailOrFail(email);
  }
}
