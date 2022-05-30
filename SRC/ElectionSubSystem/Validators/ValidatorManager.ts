//Create class validatormanager that reads config.json in order
//to create validator objects and then validates the data

import { ElectionDTO } from "../../Common/Domain";
import { IFilter } from "./IFilter";
import { DateFilter } from "./DateFilter";
import { ArrayFilter } from "./ArrayFilter";
import { PartyFilter } from "./PartyFilter";
import { ValueCategoryFilter } from "./ValueCategoryFilter";

class ValidatorManager<T> {
  election: T;
  jsonConfig: any;
  step: any;
  pipeline: IFilter[][];
  constructors: Record<string, any>;

  constructor(election: T, pipelineName: string) {
    this.jsonConfig = require("./config.json");
    this.jsonConfig = this.jsonConfig[pipelineName];
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
    for (let stepKey in this.jsonConfig) {
      this.step = this.jsonConfig[stepKey];
      let filters = this.step["filters"];
      for (let i = 0; i < filters.length; i++) {
        let filterObj = new this.constructors[filters[i]["class"]](
          filters[i]["parameters"],
          this.election
        );
        this.pipeline.push([filterObj]);
      }
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
