import { ElectionDTO } from "../../Common/Domain";

class LengthFilter {
  max: number;
  min: number;
  election: ElectionDTO;
  constructor(min: number, max: number, election: ElectionDTO) {
    this.min = min;
    this.max = max;
    this.election = election;
  }

  validate(value: string) {
    if (value.length >= this.min && value.length <= this.max) {
      console.log("Largo valido");
      return true;
    }
    console.log("Largo invalido");
    return false;
  }
}
