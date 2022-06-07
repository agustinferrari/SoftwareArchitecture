import { Candidate, Election, Party } from "../../Common/Domain";
import { IFilter } from "../../Common/Validators/IFilter";

class CandidateFilter implements IFilter {
  parties: Party[];
  candidates: Candidate[];
  key1: any;
  key2: any;
  error: string;
  maxAttempts: number;

  constructor(parameters: any, election: Election) {
    this.maxAttempts = parameters["maxAttempts"];
    this.error = parameters["errorMessage"];
    this.parties = election.parties;
    this.candidates = election.candidates;
  }

  validate() {
    for (let candidate of this.candidates) {
      let numberOfPartiesAsociated = this.parties.filter(
        (p) => p.id === candidate.partyId
      ).length;
      if (numberOfPartiesAsociated > 1) {
        throw new Error(this.error + " " + candidate.name);
      }
    }
  }
}

export { CandidateFilter };
