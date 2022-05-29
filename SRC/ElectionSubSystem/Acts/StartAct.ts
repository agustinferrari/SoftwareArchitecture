import { CandidateDTO, ElectionDTO, PartyDTO } from "../../Common/Domain";
import { AbstractAct } from "./AbstractAct";

export class StartAct extends AbstractAct {

  getActInformation(election: ElectionDTO): string {
    let electionId : string= `[Elección ${election.id}: ${election.name}] \n `;
    let startDate : string= `[Fecha de inicio: ${election.startDate.toString()}] \n `;
    let parties : string = this.getPartyInformation(election);
    let currentVoters : string = `[Cantidad de habilitados a votar ${election.voterCount}] \n `;
    let votingMode : string =`[Modalidad de votación: ${election.mode}] \n `;
    return electionId + startDate + parties + currentVoters + votingMode;
  }

  private getPartyInformation(election: ElectionDTO): string {
    let partyDTOs : PartyDTO[] = election.parties;

    let parties : string = `[Partidos:] \n `;
    for (let party of partyDTOs) {
        let currentCandidates : string = "";
        for (let i:number = 0; i < election.candidates.length; i++) {
            let candidate : CandidateDTO = election.candidates[i];
            if(candidate.partyId == party.id) {
              currentCandidates += ", ";
              currentCandidates += `${candidate.name}`;
            }
        }
        let currentParty = `[Partido: ${party.name}| Candidatos: ${currentCandidates}] \n `;
        parties += currentParty;
    }
    return parties;
  }
}
