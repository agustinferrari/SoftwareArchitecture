import { Election, ElectionResult } from "../../Common/Domain";
import { AbstractAct } from "./AbstractAct";
import { ElectionQueryQueue } from "../DataAccess/Query/ElectionQueryQueue";

export class EndAct extends AbstractAct {
  async getActInformation(election: Election, voterCount: number): Promise<string> {
    let query = new ElectionQueryQueue();
    let electionResult: ElectionResult;
    //TODO: POSIBLE REFACTOR PARA CALCULAR FUERA LOS DATOS
    let parties = await query.getPartiesResult(election.id);
    let candidates = await query.getCandidatesResult(election.id);

    electionResult = new ElectionResult(candidates, parties);
    let totalVotes = await query.getTotalVotes(election.id);

    let electionId: string = `[Elección ${election.id}: ${election.name}] \n `;
    let startDate: string = `[Fecha de inicio: ${election.startDate.toString()}] \n `;
    let endDate: string = `[Fecha de fin: ${election.startDate.toString()}] \n `;
    let currentVoters: string = `[Cantidad de habilitados a votar ${voterCount}] \n `;
    let totalVotesStr: string = `[Cantidad total de votos ${totalVotes}] \n `;
    let votingMode: string = `[Modalidad de votación: ${election.mode}] \n `;
    let electionResultStr = `[Resultado de votación: ${JSON.stringify(
      electionResult,
      null,
      "\t"
    )}] \n `;

    return (
      electionId +
      startDate +
      endDate +
      votingMode +
      currentVoters +
      totalVotesStr +
      electionResultStr
    );
  }
}
