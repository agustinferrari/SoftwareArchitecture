import { Candidate, Election, Party } from "../../Common/Domain";
import { AbstractAct } from "./AbstractAct";
import { ElectionQueryQueue } from "../DataAccess/Query/ElectionQueryQueue";

export class EndAct extends AbstractAct {
  getActInformation(election: Election, voterCount: number): string {
    //TODO: FALTA CANTIDAD DE VOTOS Y GANADOR
    let query = new ElectionQueryQueue();
    let totalVotes = query.getTotalVotes(election.id);

    let electionId: string = `[Elección ${election.id}: ${election.name}] \n `;
    let startDate: string = `[Fecha de inicio: ${election.startDate.toString()}] \n `;
    let endDate: string = `[Fecha de fin: ${election.startDate.toString()}] \n `;
    let currentVoters: string = `[Cantidad de habilitados a votar ${voterCount}] \n `;
    let totalVotesStr: string = `[Cantidad total de votos ${totalVotes}] \n `;
    let votingMode: string = `[Modalidad de votación: ${election.mode}] \n `;
    
    return electionId + startDate + endDate + votingMode + currentVoters + totalVotesStr;
  }


}
