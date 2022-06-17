import { Election } from "../../Common/Domain";
import { IFilter } from "../../Common/Validators/IFilter";

class ArrayFilter extends IFilter {
  array: any;
  key: any;
  error: string;
  maxAttempts: number;

  constructor(parameters: any, election: Election) {
    super()
    this.key = parameters["key"];
    this.error = parameters["errorMessage"];
    this.maxAttempts = parameters["maxAttempts"];
    const getKeyValue =
      <U extends keyof T, T extends object>(key: U) =>
      (obj: T) =>
        obj[key];
    let array = getKeyValue<keyof Election, Election>(this.key)(election);

    this.array = array;
  }

  async validate() {
    if (this.array.length == 0) {
      throw new Error(this.error);
    }
  }
}

export { ArrayFilter };
