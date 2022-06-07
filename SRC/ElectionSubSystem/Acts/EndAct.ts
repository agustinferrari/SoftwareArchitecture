import { Candidate, Election, Party } from "../../Common/Domain";
import { AbstractAct } from "./AbstractAct";

export class EndAct extends AbstractAct {
  getActInformation(election: Election, voterCount : number): string {
    //TODO: FALTA CANTIDAD DE VOTOS Y GANADOR
    
    let electionId: string = `[Elección ${election.id}: ${election.name}] \n `;
    let startDate: string = `[Fecha de inicio: ${election.startDate.toString()}] \n `;
    let endDate: string = `[Fecha de fin: ${election.startDate.toString()}] \n `;
    let currentVoters: string = `[Cantidad de habilitados a votar ${voterCount}] \n `;
    let parties: string = this.getPartyInformation(election);
    let votingMode: string = `[Modalidad de votación: ${election.mode}] \n `;
    return electionId + startDate + endDate + currentVoters + parties  + votingMode;
  }

  private getPartyInformation(election: Election): string {
    let partyDTOs: Party[] = election.parties;

    let parties: string = `[Partidos:] \n `;
    for (let party of partyDTOs) {
      let currentCandidates: string = "";
      for (let i: number = 0; i < election.candidates.length; i++) {
        let candidate: Candidate = election.candidates[i];
        if (candidate.partyId == party.id) {
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
