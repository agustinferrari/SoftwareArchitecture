import mongoose from "mongoose";
import {model } from "mongoose";
import { IUser, userSchema } from "../QueryAPI/Models/User";
import config from "config";

export class UserRepository {

  static _instance : UserRepository;

  static getUserRepository(): UserRepository{
    if(!UserRepository._instance){
      UserRepository._instance = new UserRepository();
    }
      return UserRepository._instance;
    
  }

   async addUser(
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
   async findByEmailOrFail(email: string): Promise<IUser> {

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
  }
}
