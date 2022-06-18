import { VoterElectionCircuitFilter } from "./VoterElectionCircuitFilter";
import { NumberFilter } from "./NumberFilter";
import { UniqueVoteFilter } from "./UniqueVoteFilter";
import { AbstractValidatorManager } from "../../Common/Validators/AbstractValidatorManager";
import { CandidateFilter } from "./CandidateFilter";
import { Query } from "../DataAccess/Query/Query";
import { RepeatedVoteFilter } from "./RepeatedVoteFilter";
import { Vote } from "../../Common/Domain";
import { InProgressValidator } from "./InProgressValidator";
import { RequestCountHelper } from "../RequestCountHelper";
import { IFilter } from "../../Common/Validators/IFilter";

export class ValidatorManager extends AbstractValidatorManager<Vote> {
  query: Query;
  toValidate: any;
  constructor(voterQuery: Query) {
    super();
    this.constructors = {
      VoterElectionCircuitFilter: VoterElectionCircuitFilter,
      NumberFilter: NumberFilter,
      UniqueVoteFilter: UniqueVoteFilter,
      RepeatedVoteFilter: RepeatedVoteFilter,
      CandidateFilter: CandidateFilter,
    };
    this.jsonConfig = require("./config.json");
    this.query = voterQuery;
  }

  createPipeline(toValidate: Vote, pipelineName: string) : IFilter[][] {

    this.toValidate = toValidate;
    let inProgressValidator = new InProgressValidator(this.jsonConfig.InProgressValidator, toValidate, this.query);
    let pipelineConfig: any = this.jsonConfig[pipelineName];
    let pipeline : IFilter[][]= [];
    pipeline.push([inProgressValidator]);
    for (let stepKey in pipelineConfig) {
      let filters = pipelineConfig[stepKey]["filters"];
      for (let i = 0; i < filters.length; i++) {
        let filterObj = new this.constructors[filters[i]["class"]](filters[i]["parameters"], toValidate, this.query);
        pipeline.push([filterObj]);
      }
    }
    return pipeline;
  }

  async validate(pipeline: IFilter[][]) {
    let errorMessages = "";
    let reqCountHelper = RequestCountHelper.getInstance();
    reqCountHelper.insideValidationCount++;
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
            reqCountHelper.validationErrorCount++;
            reqCountHelper.validationErrorType.push(e.message);
            attempts++;
            errorMessages += `Attempt: ${attempts}/${maxAttempts} | ` + e.message + "\n";
          }
        }
      }
    }
    if (errorMessages != "") {
      
      if(!reqCountHelper.exampleErrorVote){
        reqCountHelper.exampleErrorVote = this.toValidate;
      }
      
      let actualErrorMessages = errorMessages;
      errorMessages = "";
      throw new Error(actualErrorMessages);
    }
  }
}
