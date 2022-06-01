import { CandidateDTO, ElectionDTO, PartyDTO } from "../../Common/Domain";
import { IFilter } from "../../Common/Validators/IFilter";

class PartyFilter implements IFilter {
  parties: PartyDTO[];
  candidates: CandidateDTO[];
  key1: any;
  key2: any;
  error: string;

  constructor(parameters: any, election: ElectionDTO) {
    this.error = parameters["errorMessage"];
    this.parties = election.parties;
    this.candidates = election.candidates;
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
