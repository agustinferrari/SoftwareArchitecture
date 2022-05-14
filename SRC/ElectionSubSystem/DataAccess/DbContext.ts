import { Sequelize } from "sequelize-typescript";
import config from "config";

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
} from "./Models/export";

export class DbContext {
  constructor() {
    this.dbHost = config.get("SQL_DB.host");
    this.dbPort = config.get("SQL_DB.port");
    this.dbUser = config.get("SQL_DB.user");
    this.dbPassword = config.get("SQL_DB.password");
    this.dbName = config.get("SQL_DB.name");
    this.sequelize = new Sequelize(
      `mysql://${this.dbUser}:${this.dbPassword}@${this.dbHost}:${this.dbPort}/${this.dbName}`
    );
  }
  dbHost: string;
  dbPort: string;
  dbUser: string;
  dbPassword: string;
  dbName: string;
  sequelize: Sequelize;

  public async createDatabase(): Promise<void> {
    this.addModels();
    await this.syncAll();
  }

  private async syncAll(): Promise<void> {
    await Election.sync({ alter: true });
    await Party.sync({ alter: true });
    await Candidate.sync({ alter: true });
    await Voter.sync({ alter: true });
    await Circuit.sync({ alter: true });
    await ElectionCandidate.sync({ alter: true });
    await ElectionCircuit.sync({ alter: true });
    await ElectionCircuitVoter.sync({ alter: true });
  }

  private addModels(): void {
    this.sequelize.addModels([
      Election,
      ElectionCandidate,
      Candidate,
      Party,
      Voter,
      Circuit,
      ElectionCircuit,
      ElectionCircuitVoter,
    ]);
  }
}
