import { Sequelize } from "sequelize-typescript";
import { ElectionInfo, Vote, Voter } from "../Common/Domain";
import { VoterSQL, VoteSQL } from "./Models";

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
    let found = await this.sequelize.query(
      "SELECT id FROM appEvDB.ElectionSQLs;",
      {
        type: QueryTypes.SELECT,
      }
    );
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
    let found = await this.sequelize.query(queryString, {
      type: QueryTypes.SELECT,
    });
    if (found[0]) {
      return found[0]["Exists"] == 1;
    }
    return false;
  }

  public async checkUniqueVote(
    voterCI: string,
    electionId: number
  ): Promise<boolean> {
    let queryString: string = `SELECT Count(*) as 'Exists' FROM appEvDB.VoteSQLs WHERE voterCI = '${voterCI}' 
                                    AND electionId = '${electionId}';`;
    let found = await this.sequelize.query(queryString, {
      type: QueryTypes.SELECT,
    });
    if (found[0]) {
      return found[0]["Exists"] > 0;
    }
    return false;
  }

  public async checkRepeatedVote(
    voterCI: string,
    electionId: number,
    maxVotesPerVoter: number
  ): Promise<boolean> {
    let queryString: string = `SELECT Count(*) as 'VoteCount' FROM appEvDB.VoteSQLs WHERE voterCI = '${voterCI}' 
                                    AND electionId = '${electionId}';`;
    let found = await this.sequelize.query(queryString, {
      type: QueryTypes.SELECT,
    });
    if (found[0]) {
      console.log(found[0]);
      let isOverLimit = found[0]["VoteCount"] >= maxVotesPerVoter;
      return isOverLimit;
    }else{
      return false;
    }
    //TODO ver como manejar esto
    throw new Error(`Error checking vote count for voter`);
  }

  public async getVoteDates(
    electionId: number,
    voterCI: string
  ): Promise<string[]> {
    let queryString: string = `SELECT startTimestamp FROM appEvDB.VoteSQLs WHERE voterCI = '${voterCI}' 
                                    AND electionId = '${electionId}';`;
    let found: any = await this.sequelize.query(queryString, {
      type: QueryTypes.SELECT,
    });
    let result: string[] = [];
    if (found)
      for (let i = 0; i < found.length; i++) {
        if (found[i]) result.push(found[i]["startTimestamp"]);
      }
    return result;
  }

  public async getVote(voteId: string, voterCI: string): Promise<Vote> {
    let queryString: string = `SELECT * FROM appEvDB.VoteSQLs WHERE voterCI = '${voterCI}' 
                                    AND id = '${voteId}';`;
    let found: any = await this.sequelize.query(queryString, {
      type: QueryTypes.SELECT,
    });
    if(!found){
      throw new Error("Vote not found");
    }else{
      let foundVoteSQL = found[0];
      let vote : Vote = new Vote();
      vote.candidateCI= foundVoteSQL.candidateCI;
      vote.voterCI = foundVoteSQL.voterCI;
      vote.electionId = foundVoteSQL.electionId;
      vote.startTimestamp = foundVoteSQL.startTimestamp;
      vote.endTimestamp= foundVoteSQL.endTimestamp;
      vote.id= foundVoteSQL.id;
      return vote;
    }
   }

  public async getVoteFrequency(electionId: number, voterCI: string): Promise<any[]> {
    let queryString: string = `SELECT hour(startTimestamp) AS 'hour', Count(*) AS 'totalVotes' FROM appEvDB.VoteSQLs WHERE electionId = '${electionId}'
                                  GROUP BY hour(startTimestamp) ORDER BY Count(*) DESC LIMIT 10;`;
    let found: any = await this.sequelize.query(queryString, { type: QueryTypes.SELECT });
    return found;
  }
}
