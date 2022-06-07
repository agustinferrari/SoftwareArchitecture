import { Election } from "../../Common/Domain";
import { IFilter } from "../../Common/Validators/IFilter";

class ValueCategoryFilter implements IFilter {
  value: string;
  categories: string[];
  key: any;
  error: string;

  constructor(parameters: any, election: Election) {
    this.key = parameters["key"];
    this.categories = parameters["categories"];
    this.error = parameters["errorMessage"];

    const getKeyValue =
      <U extends keyof T, T extends object>(key: U) =>
      (obj: T) =>
        obj[key];
    let value = getKeyValue<keyof Election, Election>(this.key)(
      election
    ).toString();
    this.value = value;
  }

  validate() {
    if (this.categories.indexOf(this.value) <= -1) {
      throw new Error(
        this.error + this.value + " no pertenece a [" + this.categories + "])"
      );
    }
  }
}

export { ValueCategoryFilter };
