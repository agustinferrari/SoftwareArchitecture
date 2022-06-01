import { Sequelize } from "sequelize-typescript";
import config from "config";

import {
  Election,
  ElectionCandidate,
  ElectionCircuit,
  ElectionCircuitVoter,
  Party,
  Candidate,
  Voter,
  Circuit,
} from "./";

export class SequelizeContext {
  connection: Sequelize;

  public constructor() {
    const dbHost = config.get("SQL_DB.host");
    const dbPort = config.get("SQL_DB.port");
    const dbUser = config.get("SQL_DB.user");
    const dbPassword = config.get("SQL_DB.password");
    const dbName = config.get("SQL_DB.name");

    this.connection = new Sequelize(
      `mysql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`,
      {
        logging: false,
        pool: {
          max: 100,
          min: 0,
          idle: 200000,
          // @note https://github.com/sequelize/sequelize/issues/8133#issuecomment-359993057
          acquire: 1000000,
        },
      }
    );
  }

  public async addModels() {
    this.connection.addModels([
      Election,
      ElectionCandidate,
      ElectionCircuitVoter,
      ElectionCircuit,
      Circuit,
      Party,
      Voter,
      Candidate,
    ]);
  }

  public async syncAllModels() {
    await Election.sync({ alter: true });
    await Party.sync({ alter: true });
    await Candidate.sync({ alter: true });
    await Voter.sync({ alter: true });
    await Circuit.sync({ alter: true });
    await ElectionCandidate.sync({ alter: true });
    await ElectionCircuit.sync({ alter: true });
    await ElectionCircuitVoter.sync({ alter: true });
  }
}
