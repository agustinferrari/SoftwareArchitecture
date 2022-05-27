import { INotificationSender } from "../../Common/NotificationSender/INotificationSender";
import { ElectionModel } from "../../Common/Redis";
import { CandidateModel } from "../../Common/Redis/CandidateModel";
import { PartyModel } from "../../Common/Redis/PartyModel";
import { AbstractAct } from "./AbstractAct";

export class StartAct extends AbstractAct {

  getActInformation(election: ElectionModel): string {
    let electionId : string= `[Elección ${election.id}: ${election.name}] \n `;
    let startDate : string= `[Fecha de inicio: ${election.startDate.toString()}] \n `;
    let parties : string = this.getPartyInformation(election.parties);
    let currentVoters : string = `[Cantidad de habilitados a votar ${election.voterCount}] \n `;
    let votingMode : string =`[Modalidad de votación: ${election.mode}] \n `;
    return electionId + startDate + parties + currentVoters + votingMode;
  }

  private getPartyInformation(partyModels: PartyModel[]): string {
    let parties : string = `[Partidos:] \n `;
    for (let party of partyModels) {
        let currentCandidates : string = "";
        for (let i:number = 0; i < party.candidates.length; i++) {
            let candidate : CandidateModel = party.candidates[i];
            currentCandidates += `${candidate.name}`;
            if(i < party.candidates.length - 1){
                currentCandidates += ", ";
            }
        }
        let currentParty = `[Partido: ${party.name}| Candidatos: ${currentCandidates}] \n `;
        parties += currentParty;
    }
    return parties;
  }
}
