import { Sequelize } from "sequelize-typescript";
import { ElectionInfo } from "../Common/Domain";

const { QueryTypes } = require("sequelize");

export class QuerySQL {
  sequelize: Sequelize;
  public constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
  }

  public async getElectionsInfo(): Promise<ElectionInfo[]> {
    let found = await this.sequelize.query("SELECT id FROM appEvDB.ElectionSQLs;", { type: QueryTypes.SELECT });
    let result: ElectionInfo[] = [];
    if (found) {
      for (let i = 0; i < found.length; i++) {
        let obj = { id: found[i] };
        let election: ElectionInfo = new ElectionInfo(obj);
        result.push(election);
      }
    }
    return result;
  }

  public async voterElectionCircuit(voterCI: string, electionId: number, circuitId: number): Promise<boolean> {
    let queryString: string = `SELECT Count(*) as 'Exists' FROM appEvDB.ElectionCircuitVoterSQLs WHERE voterCI = '${voterCI}' 
                                    AND electionCircuitId = '${electionId}_${circuitId}';`;
    let found = await this.sequelize.query(queryString, { type: QueryTypes.SELECT });
    if (found[0]) {
      return found[0]["Exists"] == 1;
    }
    return false;
  }
}
