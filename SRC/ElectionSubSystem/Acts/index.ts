export * from "./AbstractAct";
import { Election, ElectionResult } from "../../Common/Domain";

export * from "./StartAct";
export * from "./EndAct";

import { ElectionQueryQueue } from "../DataAccess/Query/ElectionQueryQueue";

const run = async () => {
  //TODO: FALTA CANTIDAD DE VOTOS Y GANADOR

  let query = new ElectionQueryQueue();
  let electionResult: ElectionResult;

  let parties = await query.getPartiesResult(33622);
  let candidates = await query.getCandidatesResult(33622);

  electionResult = new ElectionResult(candidates, parties);
  let totalVotes = await query.getTotalVotes(33622);

  let electionId: string = `[Elección ${33622}: $ \n `;
  let startDate: string = `[Fecha de inicio: ] \n `;
  let endDate: string = `[Fecha de fin: ] \n `;
  let currentVoters: string = `[Cantidad de habilitados a votar }] \n `;
  let totalVotesStr: string = `[Cantidad total de votos }] \n `;
  let votingMode: string = `[Modalidad de votación: .}] \n `;
  let electionResultStr = `[Resultado de votación: ${JSON.stringify(
    electionResult,
    null,
    "\t"
  )}] \n `;

  console.log(
    electionId +
      startDate +
      endDate +
      votingMode +
      currentVoters +
      totalVotesStr +
      electionResultStr
  );
};

run();
