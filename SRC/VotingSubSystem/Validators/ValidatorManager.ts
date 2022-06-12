import { VoterElectionCircuitFilter } from "./VoterElectionCircuitFilter";
import { NumberFilter } from "./NumberFilter";
import { UniqueVoteFilter } from "./UniqueVoteFilter";
import { AbstractValidatorManager } from "../../Common/Validators/AbstractValidatorManager";
import { CandidateFilter } from "./CandidateFilter";
import { Query } from "../DataAccess/Query/Query";
import { VoteIntent } from "../Models/VoteIntent";
import { RepeatedVoteFilter } from "./RepeatedVoteFilter";

export class ValidatorManager extends AbstractValidatorManager<VoteIntent> {
  query: Query;
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

  createPipeline(toValidate: VoteIntent, pipelineName: string) {
    let pipelineConfig: any = this.jsonConfig[pipelineName];
    this.pipeline = [];
    for (let stepKey in pipelineConfig) {
      this.step = pipelineConfig[stepKey];
      let filters = this.step["filters"];
      for (let i = 0; i < filters.length; i++) {
        let filterObj = new this.constructors[filters[i]["class"]](filters[i]["parameters"], toValidate, this.query);
        this.pipeline.push([filterObj]);
      }
    }
  }
}
