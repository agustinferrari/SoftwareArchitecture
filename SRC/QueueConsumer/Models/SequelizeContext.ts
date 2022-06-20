import { Sequelize } from "sequelize-typescript";
import config from "config";
const { QueryTypes } = require("sequelize");

import { ElectionSQL, ElectionCandidateSQL, ElectionCircuitSQL, ElectionCircuitVoterSQL, PartySQL, CandidateSQL, VoterSQL, CircuitSQL, VoteSQL, ElectionCandidateVoterSQL } from "./";

export class SequelizeContext {
  connection: Sequelize;

  public constructor(port? : string) {
    const dbHost = config.get("SQL_DB.host");
    let dbPort = port ? port : config.get("SQL_DB.port");
    const dbUser = config.get("SQL_DB.user");
    const dbPassword = config.get("SQL_DB.password");
    const dbName = config.get("SQL_DB.name");
    


    this.connection = new Sequelize(`mysql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`, {
      logging: false,
      pool: {
        max: 500,
        min: 0,
        idle: 200000,
        // @note https://github.com/sequelize/sequelize/issues/8133#issuecomment-359993057
        acquire: 1000000,
      },
    });
  }

  public async addModels() {
    this.connection.addModels([ElectionSQL, ElectionCandidateSQL, ElectionCircuitVoterSQL, ElectionCircuitSQL, CircuitSQL, PartySQL, VoterSQL, CandidateSQL, VoteSQL, ElectionCandidateVoterSQL]);
  }

  public async setMaxConnections(){
    await this.connection.query(`set global max_connections = 15000;`, { type: QueryTypes.SET });
  }

  public async syncAllModels() {
    await ElectionSQL.sync({ alter: true });
    await PartySQL.sync({ alter: true });
    await CandidateSQL.sync({ alter: true });
    await VoterSQL.sync({ alter: true });
    await CircuitSQL.sync({ alter: true });
    await ElectionCandidateSQL.sync({ alter: true });
    await ElectionCircuitSQL.sync({ alter: true });
    await ElectionCircuitVoterSQL.sync({ alter: true });
    await VoteSQL.sync({ alter: true });
    await ElectionCandidateVoterSQL.sync({ alter: true });
  }
}
