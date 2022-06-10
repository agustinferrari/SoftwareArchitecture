import{Document, Schema } from "mongoose";

export interface IUser extends Document {
    email: string;
    password: string;
    role: string;
}

export const userSchema = new Schema<IUser>({
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: String,
  });
