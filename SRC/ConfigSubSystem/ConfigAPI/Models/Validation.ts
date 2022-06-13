import { Document, Schema } from "mongoose";

export interface IValidationInput extends Document {
  processName: string;
  filters: any;
}

export class ValidationInput {
  processName: string;
  filters: any;

  constructor(processName: string, filters: any) {
    this.processName = processName;
    this.filters = filters;
  }
}

export const validationSchema = new Schema<IValidationInput>({
  processName: { type: String, required: true },
  filters: { type: Object, required: true },
});
