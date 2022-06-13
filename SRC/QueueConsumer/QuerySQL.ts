import { Sequelize } from "sequelize-typescript";
import { ElectionInfo, Voter } from "../Common/Domain";
import { VoterSQL } from "./Models";

const { QueryTypes } = require("sequelize");

export class QuerySQL {
  sequelize: Sequelize;
  public constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
  }

  public async getVoter(ci: string): Promise<Voter> {
    let found = await VoterSQL.findByPk(ci);
    if (!found) {
      throw new Error("Voter not found");
    }
    let voter: Voter = new Voter(found);
    return voter;
  }

  public async getElectionsInfo(): Promise<ElectionInfo[]> {
    let found = await this.sequelize.query("SELECT id FROM appEvDB.ElectionSQLs;", {
      type: QueryTypes.SELECT,
    });
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

  public async voterElectionCircuit(
    voterCI: string,
    electionId: number,
    circuitId: number
  ): Promise<boolean> {
    let queryString: string = `SELECT Count(*) as 'Exists' FROM appEvDB.ElectionCircuitVoterSQLs WHERE voterCI = '${voterCI}' 
                                    AND electionCircuitId = '${electionId}_${circuitId}';`;
    let found = await this.sequelize.query(queryString, { type: QueryTypes.SELECT });
    if (found[0]) {
      return found[0]["Exists"] == 1;
    }
    return false;
  }

  public async checkUniqueVote(voterCI: string, electionId: number): Promise<boolean> {
    let queryString: string = `SELECT Count(*) as 'Exists' FROM appEvDB.VoteSQLs WHERE voterCI = '${voterCI}' 
                                    AND electionId = '${electionId}';`;
    let found = await this.sequelize.query(queryString, { type: QueryTypes.SELECT });
    if (found[0]) {
      return found[0]["Exists"] == 1;
    }
    return false;
  }

  public async checkRepeatedVote(voterCI: string, electionId: number): Promise<number> {
    let queryString: string = `SELECT Count(*) as 'VoteCount' FROM appEvDB.VoteSQLs WHERE voterCI = '${voterCI}' 
                                    AND electionId = '${electionId}';`;
    let found = await this.sequelize.query(queryString, { type: QueryTypes.SELECT });
    if (found[0]) {
      return found[0]["VoteCount"];
    }
    //TODO ver como manejar esto
    throw new Error(`Error checking vote count for voter`);
  }

  public async getVoteDates(electionId: number, voterCI: string): Promise<string[]> {
    let queryString: string = `SELECT startTimestamp FROM appEvDB.VoteSQLs WHERE voterCI = '${voterCI}' 
                                    AND electionId = '${electionId}';`;
    let found: any = await this.sequelize.query(queryString, { type: QueryTypes.SELECT });
    let result: string[] = [];
    if (found)
      for (let i = 0; i < found.length; i++) {
        if (found[i]) result.push(found[i]["startTimestamp"]);
      }
    console.log(result);
    return result;
  }
}
