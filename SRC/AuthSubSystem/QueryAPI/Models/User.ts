import { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  role: string;
  ci: string;
}

export class UserDTO {
  email: string;
  role: string;
  ci: string;

  constructor(email: string, ci: string, role: string) {
    this.email = email;
    this.role = role;
    this.ci = ci;
  }
}

export const userSchema = new Schema<IUser>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  ci: { type: String, required: true },
});
