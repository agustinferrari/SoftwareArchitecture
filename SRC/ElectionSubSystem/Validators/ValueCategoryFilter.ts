import { ElectionDTO } from "../../Common/Domain";
import { IFilter } from "../../Common/Validators/IFilter";

//create class ValueCategoryFilter that validates if a value is in a category array
class ValueCategoryFilter implements IFilter /*<[string, string[]]>*/ {
  value: string;
  categories: string[];
  key: any;
  constructor(parameters: any, election: ElectionDTO) {
    this.key = parameters["key"];
    this.categories = parameters["categories"];
    const getKeyValue =
      <U extends keyof T, T extends object>(key: U) =>
      (obj: T) =>
        obj[key];
    let value = getKeyValue<keyof ElectionDTO, ElectionDTO>(this.key)(
      election
    ).toString();
    this.value = value;
  }
  //Method to validate value
  validate() {
    if (this.categories.indexOf(this.value) > -1) {
      console.log("Categoria valida (" + this.value + ")");
      return true;
    }
    console.log(
      "Categoria invalida (" +
        this.value +
        " no pertenece a [" +
        this.categories +
        "])"
    );
    return false;
  }
}

export { ValueCategoryFilter };
