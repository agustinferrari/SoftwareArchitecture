import { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  role: string;
}

export class UserDTO {
  email: string;
  role?: string;

  constructor(email: string, role?: string) {
    this.email = email;
    this.role = role;
  }
}

export const userSchema = new Schema<IUser>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: String,
});
