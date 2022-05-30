import { CandidateDTO, ElectionDTO, PartyDTO } from "../../Common/Domain";
import { IFilter } from "./IFilter";

class CandidateFilter implements IFilter /*<[PartyDTO[], CandidateDTO[]]>*/ {
  parties: PartyDTO[];
  candidates: CandidateDTO[];
  key1: any;
  key2: any;
  constructor(parameters: any, election: ElectionDTO) {
    this.parties = election.parties;
    this.candidates = election.candidates;
  }

  validate() {
    for (let candidate of this.candidates) {
      let numberOfPartiesAsociated = this.parties.filter(
        (p) => p.id === candidate.partyId
      ).length;
      if (numberOfPartiesAsociated === 0) {
        console.log(
          "Candidatos invalidos (" +
            candidate.name +
            " no tiene partido asociado)"
        );
        return false;
      } else if (numberOfPartiesAsociated > 1) {
        console.log(
          "Candidatos invalidos (" +
            candidate.name +
            " esta asociado a mas de un partido)"
        );
        return false;
      }
    }
    console.log("Partidos validos (todos tienen candidatos)");
    return true;
  }
}

export { CandidateFilter };
