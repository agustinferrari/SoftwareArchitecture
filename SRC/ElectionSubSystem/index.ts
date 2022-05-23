import { APIConsumer } from "./ElectoralConsumer/APIConsumer";
import { IConsumer } from "./ElectoralConsumer/IConsumer";
import {APIScheduler} from "./EventScheduler/APIScheduler";
let specificConsumer: IConsumer = new APIConsumer([]);

import {
  Election,
  ElectionCandidate,
  ElectionCircuit,
  ElectionCircuitVoter,
  Party,
  Person,
  Candidate,
  Voter,
  Circuit,
} from "../Common/Models";

import { ElectionCommand } from "./DataAccess/Command/ElectionCommand";
import { Sequelize } from "sequelize-typescript";

import { sequelizeContext, syncAllModels } from "../Common/Models";

sequelizeContext.addModels([
  Election,
  ElectionCandidate,
  ElectionCircuitVoter,
  ElectionCircuit,
  Circuit,
  Party,
  Voter,
  Candidate,
]);

const scheduler = new APIScheduler();
scheduler.startRecurrentFetch();



// async function addOneElection() {

//   await syncAllModels();

//   let foundElection1 = await specificConsumer.getElection(7);
//   let foundElection2 = await specificConsumer.getElection(8);
//   let electionCommand = new ElectionCommand();
//   electionCommand.addElections([foundElection1, foundElection2]);

// }
// addOneElection();

