//Create class validatormanager that reads config.json in order
//to create validator objects and then validates the data

import { ElectionDTO } from "../../Common/Domain";
import { IFilter } from "./IFilter";
import { DateFilter } from "./DateFilter";
import { ArrayFilter } from "./ArrayFilter";
import { PartyFilter } from "./PartyFilter";
import { ValueCategoryFilter } from "./ValueCategoryFilter";

class ValidatorManager<T> {
  election: ElectionDTO;
  configObject: any;
  jsonString: any;
  pipeline: IFilter[][];
  constructors: Record<string, any>;

  constructor(election: ElectionDTO) {
    this.jsonString = require("./config.json");
    this.configObject = []; // JSON.parse(this.jsonString);
    this.pipeline = [];
    this.constructors = {
      ArrayFilter: ArrayFilter,
      DateFilter: DateFilter,
      PartyFilter: PartyFilter,
      ValueCategoryFilter: ValueCategoryFilter,
    };
    this.election = election;
  }

  createPipeline() {
    for (var filter in this.jsonString) {
      let re = /^(\d+ )/;
      let filterName = filter.replace(re, "");
      let filterObj = new this.constructors[filterName](
        this.jsonString[filter],
        this.election
      );
      this.pipeline.push([filterObj]);
    }
  }

  validate() {
    for (let i = 0; i < this.pipeline.length; i++) {
      for (let j = 0; j < this.pipeline[i].length; j++) {
        if (!this.pipeline[i][j].validate()) {
          console.log("false");
          return false;
        }
      }
    }
    console.log("true");
    return true;
  }
}

export { ValidatorManager };
