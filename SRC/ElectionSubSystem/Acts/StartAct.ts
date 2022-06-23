import { Candidate, Election, Party } from "../../Common/Domain";
import { AbstractAct } from "./AbstractAct";

export class StartAct extends AbstractAct {
  async getActInformation(election: Election, voterCount: number): Promise<string> {
    // let electionId: string = `[Elección ${election.id}: ${election.name}] \n `;
    // let startDate: string = `[Fecha de inicio: ${election.startDate.toString()}] \n `;
    // let parties: string = this.getPartyInformation(election);
    // let currentVoters: string = `[Cantidad de habilitados a votar ${voterCount}] \n `;
    // let votingMode: string = `[Modalidad de votación: ${election.mode}] \n `;
    // let message = electionId + startDate + parties + currentVoters + votingMode;
    
    let result = {
      election: `${election.id}: ${election.name}`,
      startDate: `${election.startDate.toString()}`,
      parties: JSON.stringify(this.getPartyInformationAsObject(election)),
      currentVoters: `${voterCount}`,
      votingMode: `${election.mode}`,
    }

    return JSON.stringify(result);
  }


  private getPartyInformationAsObject(election: Election ):any{
    let partyDTOs: Party[] = election.parties;
    let parties : any[] =[];
    for (let party of partyDTOs) {
      let currentParty: any = {partyName: party.name, candidates: []};
      for (let i: number = 0; i < election.candidates.length; i++) {
        let candidate: Candidate = election.candidates[i];
        if (candidate.partyId == party.id) {
          let candidateAsObj : any = {
            candidateName: candidate.name,
            candidateLastName: candidate.lastName,
            candidateCI: candidate.ci
          }
          currentParty.candidates.push(candidateAsObj);
        }
      }
      parties.push(currentParty);
    }
    return parties;
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
