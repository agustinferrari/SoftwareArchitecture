import { IFilter } from "../../Common/Validators/IFilter";
import { Query } from "../DataAccess/Query/Query";
import { VoteIntent } from "../Models/VoteIntent";

export class VoterElectionCircuitFilter implements IFilter {
  voterCI: any;
  electionId: any;
  circuitId: any;
  key1: any;
  key2: any;
  key3: any;
  error: string;
  maxAttempts: number;
  voteQuery: Query;

  constructor(parameters: any, vote: VoteIntent, voteQuery: Query) {
    this.key1 = parameters["key1"];
    this.key2 = parameters["key2"];
    this.key3 = parameters["key3"];
    this.error = parameters["errorMessage"];
    this.maxAttempts = parameters["maxAttempts"];
    this.voteQuery = voteQuery;
    const getKeyValue =
      <U extends keyof T, T extends object>(key: U) =>
      (obj: T) =>
        obj[key];

    this.voterCI = getKeyValue<keyof VoteIntent, VoteIntent>(this.key1)(vote);
    this.electionId = getKeyValue<keyof VoteIntent, VoteIntent>(this.key2)(vote);
    this.circuitId = getKeyValue<keyof VoteIntent, VoteIntent>(this.key3)(vote);
  }

  async validate() {
    let passValidator = await this.voteQuery.voterElectionCircuit(this.voterCI, this.electionId, this.circuitId);
    if(!passValidator) {
      throw new Error(this.error);
    }
  }
}
