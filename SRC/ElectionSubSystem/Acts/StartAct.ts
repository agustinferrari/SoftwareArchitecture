import { Candidate, Election, Party } from "../../Common/Domain";
import { AbstractAct } from "./AbstractAct";

export class StartAct extends AbstractAct {
  async getActInformation(election: Election, voterCount: number): Promise<string> {
    let electionId: string = `[Elección ${election.id}: ${election.name}] \n `;
    let startDate: string = `[Fecha de inicio: ${election.startDate.toString()}] \n `;
    let parties: string = this.getPartyInformation(election);
    let currentVoters: string = `[Cantidad de habilitados a votar ${voterCount}] \n `;
    let votingMode: string = `[Modalidad de votación: ${election.mode}] \n `;
    return electionId + startDate + parties + currentVoters + votingMode;
  }

  private getPartyInformation(election: Election): string {
    let partyDTOs: Party[] = election.parties;

    let parties: string = `[Partidos:] \n `;
    for (let party of partyDTOs) {
      let currentCandidates: string = "";
      for (let i: number = 0; i < election.candidates.length; i++) {
        let candidate: Candidate = election.candidates[i];
        if (candidate.partyId == party.id) {
          currentCandidates += `${candidate.name} ${candidate.lastName}`;
          if (i < election.candidates.length - 1) {
            currentCandidates += ", ";
          }
        }
      }
      let currentParty = `[Partido: ${party.name} | Candidatos: ${currentCandidates}] \n `;
      parties += currentParty;
    }
    return parties;
  }
}
