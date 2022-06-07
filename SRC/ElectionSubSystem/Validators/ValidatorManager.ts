//Create class validatormanager that reads config.json in order
//to create validator objects and then validates the data

import { Election } from "../../Common/Domain";
import { DateFilter } from "./DateFilter";
import { ArrayFilter } from "./ArrayFilter";
import { PartyFilter } from "./PartyFilter";
import { ValueCategoryFilter } from "./ValueCategoryFilter";
import { AbstractValidatorManager } from "../../Common/Validators/AbstractValidatorManager";
import { CandidateFilter } from "./CandidateFilter";
class ValidatorManager extends AbstractValidatorManager<Election> {
  constructor() {
    super();
    this.constructors = {
      ArrayFilter: ArrayFilter,
      DateFilter: DateFilter,
      PartyFilter: PartyFilter,
      ValueCategoryFilter: ValueCategoryFilter,
      CandidateFilter: CandidateFilter,
    };
  }
}

export { ValidatorManager };
