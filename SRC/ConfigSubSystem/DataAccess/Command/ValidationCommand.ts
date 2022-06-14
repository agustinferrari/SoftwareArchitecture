import mongoose from "mongoose";
import { model } from "mongoose";
import { IValidationInput, validationSchema } from "../../ConfigAPI/Models/Validation";
import config from "config";

export class ValidationCommand {
  static async addValidation(validation: IValidationInput): Promise<void> {
    const Validation = model<IValidationInput>("Validation", validationSchema, "Validations");

    await mongoose.connect(
      `mongodb://localhost:${config.get("MONGO.port")}/${config.get("MONGO.dbName")}`
    );

    const newVal = new Validation({
      processName: validation.processName,
      filters: validation.filters,
    });
    await newVal.save();
    console.log("Validation for " + validation.processName + " saved to database");

    return;
  }
}
