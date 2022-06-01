import { IFilter } from "./IFilter";

abstract class AbstractValidatorManager<T> {
  jsonConfig: any;
  step: any;
  pipeline: IFilter[][];
  constructors: Record<string, any>;

  constructor() {
    this.jsonConfig = require("./config.json");
    this.pipeline = [];
    this.constructors = {};
  }

  createPipeline(toValidate: T, pipelineName: string) {
    let pipelineConfig : any= this.jsonConfig[pipelineName];
    this.pipeline = [];
    for (let stepKey in pipelineConfig) {
      this.step = pipelineConfig[stepKey];
      let filters = this.step["filters"];
      for (let i = 0; i < filters.length; i++) {
        let filterObj = new this.constructors[filters[i]["class"]](
          filters[i]["parameters"],
          toValidate
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

export { AbstractValidatorManager };
