import { IFilter } from "./IFilter";

abstract class AbstractValidatorManager<T> {
  jsonConfig: any;
  step: any;
  pipeline: IFilter[][];
  constructors: Record<string, any>;
  errorMessages: string;

  constructor() {
    this.pipeline = [];
    this.constructors = {};
    this.errorMessages = "";
  }

  createPipeline(toValidate: T, pipelineName: string) {
    let pipelineConfig: any = this.jsonConfig[pipelineName];
    this.pipeline = [];
    for (let stepKey in pipelineConfig) {
      this.step = pipelineConfig[stepKey];
      let filters = this.step["filters"];
      for (let i = 0; i < filters.length; i++) {
        let filterObj = new this.constructors[filters[i]["class"]](filters[i]["parameters"], toValidate);
        this.pipeline.push([filterObj]);
      }
    }
  }

  async validate() {
    let errorMessages = "";
    for (let i = 0; i < this.pipeline.length; i++) {
      for (let j = 0; j < this.pipeline[i].length; j++) {
        let passedFilter: boolean = false;
        let attempts: number = 0;
        let maxAttempts: number = this.pipeline[i][j].maxAttempts;
        while (!passedFilter && attempts < maxAttempts) {
          try {
            await this.pipeline[i][j].validate();
            passedFilter = true;
          } catch (e: any) {
            attempts++;
            errorMessages += `Attempt: ${attempts}/${maxAttempts} | ` + e.message + "\n";
          }
        }
      }
    }
    if (errorMessages != "") {
      let actualErrorMessages = errorMessages;
      errorMessages = "";
      throw new Error(actualErrorMessages);
    }
  }
}

export { AbstractValidatorManager };
