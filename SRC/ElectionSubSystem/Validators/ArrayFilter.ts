import { ElectionDTO } from "../../Common/Domain";
import { IFilter } from "../../Common/Validators/IFilter";

class ArrayFilter implements IFilter {
  array: any;
  key: any;
  error: string;
  constructor(parameters: any, election: ElectionDTO) {
    this.key = parameters["key"];
    this.error = parameters["errorMessage"];
    const getKeyValue =
      <U extends keyof T, T extends object>(key: U) =>
      (obj: T) =>
        obj[key];
    let array = getKeyValue<keyof ElectionDTO, ElectionDTO>(this.key)(election);

    this.array = array;
  }

  validate() {
    if (this.array.length == 0) {
      throw new Error(this.error);
    }
  }
}

export { ArrayFilter };
