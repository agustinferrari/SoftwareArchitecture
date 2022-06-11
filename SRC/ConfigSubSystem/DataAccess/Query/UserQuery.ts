
import mongoose from "mongoose";
import {model } from "mongoose";
import { IUser, userSchema } from "../../ConfigAPI/Models/User";
import config from "config";

export class UserQuery{
static async findByEmailOrFail(email: string): Promise<IUser> {

    const User = model<IUser>("User", userSchema);
    await mongoose.connect(
      `mongodb://localhost:${config.get("MONGO.port")}/${config.get(
        "MONGO.dbName"
      )}`
    );
    const user = await User.findOne({ email: email }).exec();

    if (user) {
      return user;
    } else {
      throw new Error("User not found repo");
    }
  
}}