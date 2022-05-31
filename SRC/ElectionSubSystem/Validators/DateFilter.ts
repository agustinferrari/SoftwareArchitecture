import { ElectionDTO } from "../../Common/Domain";
import { IFilter } from "../../Common/Validators/IFilter";

class DateFilter implements IFilter /*<[Date, Date]>*/ {
  startDate: Date;
  endDate: Date;
  key1: any;
  key2: any;
  constructor(parameters: any, election: ElectionDTO) {
    this.key1 = parameters["key1"];
    this.key2 = parameters["key2"];

    const getKeyValue =
      <U extends keyof T, T extends object>(key: U) =>
      (obj: T) =>
        obj[key];
    let startDate = getKeyValue<keyof ElectionDTO, ElectionDTO>(this.key1)(
      election
    ).toString();
    let endDate = getKeyValue<keyof ElectionDTO, ElectionDTO>(this.key2)(
      election
    ).toString();

    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
  }

  validate() {
    if (this.startDate < this.endDate) {
      console.log("Fecha valida (" + this.key1 + " < " + this.key2 + ")");
      return true;
    }
    console.log("Fecha invalida " + this.startDate + " > " + this.endDate);
    return false;
  }
}

export { DateFilter };
