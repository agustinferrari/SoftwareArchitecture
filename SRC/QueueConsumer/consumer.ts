import { Candidate, Circuit, Election, Party } from "../Common/Domain";
import {
  CandidateSQL,
  CircuitSQL,
  ElectionCandidateSQL,
  ElectionCircuitSQL,
  ElectionSQL,
  PartySQL,
  SequelizeContext,
} from "../Common/Models";

let context: SequelizeContext = new SequelizeContext();
context.addModels();
context.syncAllModels();

async function addElection(election: Election): Promise<void> {
  let circuitPromises: Promise<void>[] = [];
  election.circuits.map(async (c: Circuit) => {
    circuitPromises.push(CircuitSQL.create(c, { ignoreDuplicates: true }));
  });

  let partyPromises: Promise<void>[] = [];
  election.parties.map((p: Party) => {
    partyPromises.push(PartySQL.create(p, { ignoreDuplicates: true }));
  });

  let candidatePromises: Promise<void>[] = [];

  await Promise.all(partyPromises).then(async () => {
    await ElectionSQL.create(election);
    election.candidates.map((c: Candidate) => {
      candidatePromises.push(
        CandidateSQL.create(c, { ignoreDuplicates: true })
      );
    });
  });

  let resolvePromises: Promise<any>[] = [];
  await Promise.all(candidatePromises).then(() => {
    election.candidates.map((c: Candidate) => {
      resolvePromises.push(
        ElectionCandidateSQL.create({
          candidateCI: c.ci,
          electionId: election.id,
        })
      );
    });
  });

  await Promise.all(circuitPromises).then(() => {
    election.circuits.map(async (c: Circuit) => {
      resolvePromises.push(
        ElectionCircuitSQL.create({
          electionCircuitId: `${election.id}_${c.id}`,
          electionId: election.id,
          circuitId: c.id,
        })
      );
    });
  });

  await Promise.all(resolvePromises);
}

//Consumidor

import Queue from "bull";
import config from "config";
import {QueueJob, QueueResponse} from "../Common/Queues";

const queue = new Queue<QueueJob>("sqlqueue", {
  redis: { port: config.get("REDIS.port"), host: config.get("REDIS.host") },
});

async function consumer() {
  console.log("Consumer started");
  queue.process(async function (job, done) {
    console.log("Received job:", job.data.type);
    console.log("Election job:", job.data.input);
    let election: Election = new Election(job.data.input);
    let response: QueueResponse = new QueueResponse();
    try{
        await addElection(job.data.input);
    }catch(e:any){
        response.error=e.message;
    }
    response.result = "200 OK";
    
    done(null, response);
  });
}


(async () => {
  consumer();
})();
