import { ElectionDTO } from "../../Common/Domain";
import { IFilter } from "../../Common/Validators/IFilter";

class ArrayFilter implements IFilter /*<any[]>*/ {
  array: any;
  key: any;
  constructor(parameters: any, election: ElectionDTO) {
    this.key = parameters["key"];
    const getKeyValue =
      <U extends keyof T, T extends object>(key: U) =>
      (obj: T) =>
        obj[key];
    let array = getKeyValue<keyof ElectionDTO, ElectionDTO>(this.key)(election);

    this.array = array;
  }

  validate() {
    if (this.array.length > 0) {
      console.log("Array " + this.key + " valido (no vacio)");
      return true;
    }
    console.log("Array " + this.key + " invalido (vacio)");
    return false;
  }
}

export { ArrayFilter };
