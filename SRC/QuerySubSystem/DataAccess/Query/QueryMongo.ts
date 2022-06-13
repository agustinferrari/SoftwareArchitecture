import mongoose from "mongoose";
import { model } from "mongoose";
import { IUser, userSchema } from "../../QueryAPI/Models/User";
import config from "config";

export class QueryMongo {
  static async findByEmailOrFail(email: string): Promise<IUser> {
    const User = model<IUser>("User", userSchema);
    await mongoose.connect(
      `mongodb://${config.get("MONGO.host")}:${config.get("MONGO.port")}/${config.get(
        "MONGO.dbName"
      )}`
    );
    const user = await User.findOne({ email: email }).exec();

    if (user) {
      return user;
    } else {
      throw new Error("User not found repo");
    }
  }
}
