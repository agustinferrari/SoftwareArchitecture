import { Sequelize } from "sequelize-typescript";
import config from "config";

export * from "./Candidate";
export * from "./Election";
export * from "./Person";
export * from "./Party";
export * from "./Voter";
export * from "./Circuit";

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
} from "./";

const dbHost = config.get("SQL_DB.host");
const dbPort = config.get("SQL_DB.port");
const dbUser = config.get("SQL_DB.user");
const dbPassword = config.get("SQL_DB.password");
const dbName = config.get("SQL_DB.name");

export const sequelizeContext = new Sequelize(
  `mysql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`
);

export async function syncAllModels() {
  await Election.sync({ alter: true });
  await Party.sync({ alter: true });
  await Candidate.sync({ alter: true });
  await Voter.sync({ alter: true });
  await Circuit.sync({ alter: true });
  await ElectionCandidate.sync({ alter: true });
  await ElectionCircuit.sync({ alter: true });
  await ElectionCircuitVoter.sync({ alter: true });
}