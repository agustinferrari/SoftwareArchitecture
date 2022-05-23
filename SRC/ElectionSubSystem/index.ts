import { APIConsumer } from "./ElectoralConsumer/APIConsumer";
import { IConsumer } from "./ElectoralConsumer/IConsumer";
import { ElectionCache, ElectionModel, RedisContext } from "./../Common/Redis";
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

async function addOneElection() {
  await syncAllModels();

  let foundElection1 = await specificConsumer.getElection(7);
  let foundElection2 = await specificConsumer.getElection(8);
  let electionCommand = new ElectionCommand();
  //electionCommand.addElections([foundElection1, foundElection2]);

  let electionCache = new ElectionCache(new RedisContext());
  electionCache.addElection(
    new ElectionModel(foundElection1.id, foundElection1.name, true)
  );
  electionCache.addElection(
    new ElectionModel(foundElection2.id, foundElection2.name, true)
  );

  let result: ElectionModel | null = await electionCache.getElection(7);
  console.log(result);
}
addOneElection();
