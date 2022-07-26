import { Election } from "../../Common/Domain";
import { IFilter } from "../../Common/Validators/IFilter";

class ValueCategoryFilter extends IFilter {
  value: string;
  categories: string[];
  key: any;
  error: string;
  maxAttempts: number;

  constructor(parameters: any, election: Election) {
    super();
    this.key = parameters["key"];
    this.categories = parameters["categories"];
    this.error = parameters["errorMessage"];
    this.maxAttempts = parameters["maxAttempts"];

    const getKeyValue =
      <U extends keyof T, T extends object>(key: U) =>
      (obj: T) =>
        obj[key];
    let value = getKeyValue<keyof Election, Election>(this.key)(
      election
    ).toString();
    this.value = value;
  }

  async validate() {
    if (this.categories.indexOf(this.value) <= -1) {
      throw new Error(
        this.error + this.value + " no pertenece a [" + this.categories + "])"
      );
    }
  }
}

export { ValueCategoryFilter };
