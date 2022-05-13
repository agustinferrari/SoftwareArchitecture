import { ElectionDTO } from "./Domain/ElectionDTO";
import { APIConsumer } from "./ElectoralConsumer/APIConsumer";
import { IConsumer } from "./ElectoralConsumer/IConsumer";
import config from "config";

let specificConsumer: IConsumer = new APIConsumer([]);

// specificConsumer.getElections().then(
//   (response: ElectionDTO[]) => {
//     console.log(response);
//   },
//   (error) => {
//     console.log(error.message);
//   }
// );

import { Sequelize } from "sequelize-typescript";

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
} from "./DataAccess/Models/export";
import { PersonDTO } from "./Domain/PersonDTO";
import { VoterDTO } from "./Domain/VoterDTO";
import { PartyDTO } from "./Domain/PartyDTO";
import { CircuitDTO } from "./Domain/CircuitDTO";
import { create } from "domain";
import { CandidateDTO } from "./Domain/CandidateDTO";

const dbHost = config.get("SQL_DB.host");
const dbPort = config.get("SQL_DB.port");
const dbUser = config.get("SQL_DB.user");
const dbPassword = config.get("SQL_DB.password");
const dbName = config.get("SQL_DB.name");

const sequelize = new Sequelize(
  `mysql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`
);

sequelize.addModels([
  Election,
  ElectionCandidate,
  // Person,
  Candidate,
  Party,
  Voter,
  Circuit,
  ElectionCircuit,
  ElectionCircuitVoter,
]);

async function syncAll() {
  await Election.sync({ alter: true });
  await Party.sync({ alter: true });
  // await Person.sync({ alter: true });
  await Candidate.sync({ alter: true });
  await Voter.sync({ alter: true });
  await Circuit.sync({ alter: true });
  await ElectionCandidate.sync({ alter: true });
  await ElectionCircuit.sync({ alter: true });
  await ElectionCircuitVoter.sync({ alter: true });

  let foundElection = await specificConsumer.getElection(8);

  let initialAdditions = async () => {
    foundElection.parties.map((p: PartyDTO) => {
      Party.create(p, { ignoreDuplicates: true });
    });

    Election.create(foundElection, {
      include: [{ model: Candidate, ignoreDuplicates: true }],
    });

    // foundElection.voters.map((v: VoterDTO) => {
    //   Voter.create(v, { ignoreDuplicates: true });
    // });

    foundElection.circuits.map((c: CircuitDTO) => {
      Circuit.create(c, { ignoreDuplicates: true }).then(() => {
        ElectionCircuit.create({
          electionCircuitId: `${foundElection.id}_${c.id}`,
          electionId: foundElection.id,
          circuitId: c.id,
        });
      });
    });
  };

  await initialAdditions();

  foundElection.voters.map((v: VoterDTO) => {
    Voter.create(v, { ignoreDuplicates: true }).then(() => {
      ElectionCircuitVoter.create({
        electionCircuitId: `${foundElection.id}_${v.circuitId}`,
        voterCI: v.ci,
      });
    });
  });
}

syncAll();
