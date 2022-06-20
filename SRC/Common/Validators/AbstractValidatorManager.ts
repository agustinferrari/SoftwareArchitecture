import { IFilter } from "./IFilter";

abstract class AbstractValidatorManager<T> {
  jsonConfig: any;
  constructors: Record<string, any>;
  errorMessages: string;

  constructor() {
    this.constructors = {};
    this.errorMessages = "";
  }

  createPipeline(toValidate: T, pipelineName: string) : IFilter[][] {
    let pipelineConfig: any = this.jsonConfig[pipelineName];
    let pipeline = [];
    for (let stepKey in pipelineConfig) {
      let filters =  pipelineConfig[stepKey]["filters"];
      for (let i = 0; i < filters.length; i++) {
        let filterObj = new this.constructors[filters[i]["class"]](filters[i]["parameters"], toValidate);
        pipeline.push([filterObj]);
      }
    }
    return pipeline;
  }

  async validate(pipeline:IFilter[][]) {
    let errorMessages = "";
    for (let i = 0; i < pipeline.length; i++) {
      for (let j = 0; j < pipeline[i].length; j++) {
        let passedFilter: boolean = false;
        let attempts: number = 0;
        let maxAttempts: number = pipeline[i][j].maxAttempts;
        while (!passedFilter && attempts < maxAttempts) {
          try {
            await pipeline[i][j].validate();
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
