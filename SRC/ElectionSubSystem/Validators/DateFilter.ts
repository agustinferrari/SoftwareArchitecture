import { Election } from "../../Common/Domain";
import { IFilter } from "../../Common/Validators/IFilter";

class DateFilter extends IFilter {
  startDate: Date;
  endDate: Date;
  key1: any;
  key2: any;
  error: string;
  maxAttempts: number;

  constructor(parameters: any, election: Election) {
    super();
    this.key1 = parameters["key1"];
    this.key2 = parameters["key2"];
    this.error = parameters["errorMessage"];
    this.maxAttempts = parameters["maxAttempts"];

    const getKeyValue =
      <U extends keyof T, T extends object>(key: U) =>
      (obj: T) =>
        obj[key];
    let startDate = getKeyValue<keyof Election, Election>(this.key1)(
      election
    ).toString();
    let endDate = getKeyValue<keyof Election, Election>(this.key2)(
      election
    ).toString();

    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
  }

  async validate() {
    if (this.startDate >= this.endDate) {
      throw new Error(
        this.error +
          " " +
          this.startDate.toUTCString() +
          " > " +
          this.endDate.toUTCString()
      );
    }
  }
}

export { DateFilter };
