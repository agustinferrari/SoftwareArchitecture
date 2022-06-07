import { Candidate, Election, Party } from "../../Common/Domain";
import { IFilter } from "../../Common/Validators/IFilter";

class PartyFilter implements IFilter {
  parties: Party[];
  candidates: Candidate[];
  key1: any;
  key2: any;
  error: string;
  maxAttempts: number;

  constructor(parameters: any, election: Election) {
    this.error = parameters["errorMessage"];
    this.parties = election.parties;
    this.candidates = election.candidates;
    this.maxAttempts = parameters["maxAttempts"];
  }

  validate() {
    for (let party of this.parties) {
      if (this.candidates.filter((c) => c.partyId === party.id).length === 0) {
        throw new Error(this.error + " " + party.name);
      }
    }
  }
}

export { PartyFilter };
