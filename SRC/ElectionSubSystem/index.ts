import { APIConsumer } from "./ElectoralConsumer/APIConsumer";
import { IConsumer } from "./ElectoralConsumer/IConsumer";
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
  // await Election.sync({ alter: true });
  // await Party.sync({ alter: true });
  // await Candidate.sync({ alter: true });
  // await Voter.sync({ alter: true });
  // await Circuit.sync({ alter: true });
  // await ElectionCandidate.sync({ alter: true });
  // await ElectionCircuit.sync({ alter: true });
  // await ElectionCircuitVoter.sync({ alter: true });
  await syncAllModels();

  let foundElection1 = await specificConsumer.getElection(7);
  let foundElection2 = await specificConsumer.getElection(8);
  let electionCommand = new ElectionCommand();
  electionCommand.addElections([foundElection1, foundElection2]);
  // let initialAdditions = async () => {
  //   foundElection.parties.map((p: PartyDTO) => {
  //     Party.create(p, { ignoreDuplicates: true });
  //   });

  //   Election.create(foundElection, {
  //     include: [{ model: Candidate, ignoreDuplicates: true }],
  //   });

  //   // foundElection.voters.map((v: VoterDTO) => {
  //   //   Voter.create(v, { ignoreDuplicates: true });
  //   // });

  //   foundElection.circuits.map((c: CircuitDTO) => {
  //     Circuit.create(c, { ignoreDuplicates: true }).then(() => {
  //       ElectionCircuit.create({
  //         electionCircuitId: `${foundElection.id}_${c.id}`,
  //         electionId: foundElection.id,
  //         circuitId: c.id,
  //       });
  //     });
  //   });
  // };

  // await initialAdditions();

  // foundElection.voters.map((v: VoterDTO) => {
  //   Voter.create(v, { ignoreDuplicates: true }).then(() => {
  //     ElectionCircuitVoter.create({
  //       electionCircuitId: `${foundElection.id}_${v.circuitId}`,
  //       voterCI: v.ci,
  //     });
  //   });
  // });
}
addOneElection();
