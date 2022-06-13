import mongoose from "mongoose";
import { model } from "mongoose";
import { IUser, userSchema } from "../../QueryAPI/Models/User";
import config from "config";

export class CommandMongo {
  static async addUser(email: string, password: string, role: string): Promise<void> {
    const User = model<IUser>("User", userSchema);

    await mongoose.connect(
      `mongodb://${config.get("MONGO.host")}:${config.get("MONGO.port")}/${config.get(
        "MONGO.dbName"
      )}`
    );

    const user = new User({
      email: email,
      password: password,
      role: role,
    });
    await user.save();
    console.log("User " + email + " saved to database");

    return;
  }
}
