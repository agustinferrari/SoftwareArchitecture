import { VoteInfo } from "../../Common/Domain";
import { VoterElectionCircuitFilter } from "./VoterElectionCircuitFilter";
import { NumberFilter } from "./NumberFilter";
import { UniqueVoteFilter } from "./UniqueVoteFilter";
import { AbstractValidatorManager } from "../../Common/Validators/AbstractValidatorManager";
import { CandidateFilter } from "./CandidateFilter";
import { VoterQuery } from "../DataAccess/Query/VoteQuery";

export class ValidatorManager extends AbstractValidatorManager<VoteInfo> {
  voteQuery: VoterQuery;
  constructor(voterQuery: VoterQuery) {
    super();
    this.constructors = {
      VoterElectionCircuitFilter: VoterElectionCircuitFilter,
      NumberFilter: NumberFilter,
      UniqueVoteFilter: UniqueVoteFilter,
      CandidateFilter: CandidateFilter,
    };
    this.jsonConfig = require("./config.json");
    this.voteQuery = voterQuery;
  }

  createPipeline(toValidate: VoteInfo, pipelineName: string) {
    let pipelineConfig: any = this.jsonConfig[pipelineName];
    this.pipeline = [];
    for (let stepKey in pipelineConfig) {
      this.step = pipelineConfig[stepKey];
      let filters = this.step["filters"];
      for (let i = 0; i < filters.length; i++) {
        let filterObj = new this.constructors[filters[i]["class"]](filters[i]["parameters"], toValidate, this.voteQuery);
        this.pipeline.push([filterObj]);
      }
    }
  }
}
