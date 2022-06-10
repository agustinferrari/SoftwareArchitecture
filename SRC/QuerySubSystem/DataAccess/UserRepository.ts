import mongoose from "mongoose";
import { Schema, model } from "mongoose";
import { IUser, userSchema } from "../QueryAPI/Models/IUser";
import config from "config";

export class UserRepository {
  static async addUser(
    email: string,
    password: string,
    role: string
  ): Promise<void> {

    const User = model<IUser>("User", userSchema);

    await mongoose.connect(
      `mongodb://localhost:${config.get("MONGO.port")}/${config.get(
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

  //find user by email
  static async findByEmailOrFail(email: string): Promise<IUser> {
    console.log("entra");

    const User = model<IUser>("User", userSchema);
    console.log(mongoose.connection.readyState);
    await mongoose.connect(
      `mongodb://localhost:${config.get("MONGO.port")}/${config.get(
        "MONGO.dbName"
      )}`
    );
    const user = await User.findOne({ email: email }).exec();

    console.log(user)
    if (user) {
      return user;
    } else {
      throw new Error("User not found repo");
    }
  }
}
