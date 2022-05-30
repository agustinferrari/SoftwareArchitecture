import { CandidateDTO, ElectionDTO, PartyDTO } from "../../Common/Domain";
import { IFilter } from "./IFilter";

class PartyFilter implements IFilter /*<[PartyDTO[], CandidateDTO[]]>*/ {
  parties: PartyDTO[];
  candidates: CandidateDTO[];
  key1: any;
  key2: any;
  constructor(parameters: any, election: ElectionDTO) {
    this.parties = election.parties;
    this.candidates = election.candidates;
  }

  validate() {
    for (let party of this.parties) {
      if (this.candidates.filter((c) => c.partyId === party.id).length === 0) {
        console.log(
          "Partidos invalidos (" + party.name + " no tiene candidatos)"
        );
        return false;
      }
    }
    console.log("Partidos validos (todos tienen candidatos)");
    return true;
  }
}

export { PartyFilter };
