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
    let found = await this.sequelize.query(queryString, {
      type: QueryTypes.SELECT,
    });
    if (found[0]) {
      return found[0]["Exists"] == 1;
    }
    return false;
  }

  public async checkUniqueVote(voterCI: string, electionId: number): Promise<boolean> {
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

  public async getVoteDates(electionId: number, voterCI: string): Promise<string[]> {
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
    if (!found) {
      throw new Error("Vote not found");
    } else {
      let foundVoteSQL = found[0];
      let vote: Vote = new Vote();
      vote.candidateCI = foundVoteSQL.candidateCI;
      vote.voterCI = foundVoteSQL.voterCI;
      vote.electionId = foundVoteSQL.electionId;
      vote.startTimestamp = foundVoteSQL.startTimestamp;
      vote.endTimestamp = foundVoteSQL.endTimestamp;
      vote.id = foundVoteSQL.id;
      return vote;
    }
  }

  public async getVoteFrequency(electionId: number, voterCI: string): Promise<any[]> {
    let queryString: string = `SELECT hour(startTimestamp) AS 'hour', Count(*) AS 'totalVotes' FROM appEvDB.VoteSQLs WHERE electionId = '${electionId}'
                                  GROUP BY hour(startTimestamp) ORDER BY Count(*) DESC LIMIT 10;`;
    let found: any = await this.sequelize.query(queryString, { type: QueryTypes.SELECT });
    return found;
  }

  public async getTotalVotes(electionId: number): Promise<number> {
    let queryString: string = ` SELECT sum(voteCount) AS 'sum' FROM appEvDB.ElectionCandidateSQLs
                                WHERE electionId = ${electionId};`;
    let found = await this.sequelize.query(queryString, {
      type: QueryTypes.SELECT,
    });
    if (found[0]) {
      return found[0]["sum"];
    }

    throw new Error(`Error getting total votes`);
  }

  public async getCandidateResult(electionId: number): Promise<any[]> {
    let queryString: string = ` SELECT candidateCI, CONCAT( C.name," ", C.lastName) AS 'Candidate full name', 
                                EC.voteCount
                                FROM appEvDB.ElectionCandidateSQLs EC, 
                                appEvDB.CandidateSQLs C
                                where EC.electionId = ${electionId}
                                AND EC.candidateCI = C.ci
                                ORDER BY EC.voteCount DESC
                                `;
    let found = await this.sequelize.query(queryString, {
      type: QueryTypes.SELECT,
    });

    return found;
  }
  public async getPartyResult(electionId: number): Promise<any[]> {
    let queryString: string = ` SELECT P.id AS "Id", 
                                P.name AS 'Party name',
                                sum(EC.voteCount) as 'Vote Count'
                                FROM appEvDB.ElectionCandidateSQLs EC, 
                                appEvDB.CandidateSQLs C,
                                appEvDB.PartySQLs P
                                where EC.electionId = ${electionId}
                                AND EC.candidateCI = C.ci
                                AND C.partyId = P.id
                                GROUP BY P.id , P.name
                                ORDER BY sum(EC.voteCount) DESC
                                ORDER BY EC.voteCount DESC
                                `;
    let found = await this.sequelize.query(queryString, {
      type: QueryTypes.SELECT,
    });
    return found;
  }

  public async getElectionInfoCountPerCircuit(
    electionId: number,
    minAge: number,
    maxAge: number,
    gender: string
  ): Promise<any[]> {
    let minAgeFilter = minAge ? `AND TIMESTAMPDIFF(YEAR, V.birthday, CURDATE()) > ${minAge}` : ``;
    let maxAgeFilter = maxAge ? `AND TIMESTAMPDIFF(YEAR, V.birthday, CURDATE()) < ${maxAge}` : ``;
    let genderFilter = gender ? `AND V.gender = '${gender}'` : ``;
    let queryString: string = `
    SELECT  Q1.circuitId, voters, votes
    FROM
    (SELECT ECV.circuitId, Count(V.ci) as voters
      FROM appEvDB.ElectionCircuitVoterSQLs ECV, appEvDB.VoterSQLs V 
      WHERE ECV.electionId = ${electionId} AND ECV.voterCI = V.ci ${minAgeFilter} ${maxAgeFilter} ${genderFilter}
    GROUP BY circuitId ORDER BY ECV.circuitId ASC) Q1,
    (SELECT ECV.circuitId, Count(V.ci) as votes
      FROM appEvDB.ElectionCircuitVoterSQLs ECV, appEvDB.VoterSQLs V, appEvDB.VoteSQLs Vo
      WHERE ECV.electionId = ${electionId} AND ECV.voterCI = V.ci AND Vo.voterCI = V.ci ${minAgeFilter} ${maxAgeFilter} ${genderFilter}
    GROUP BY circuitId ORDER BY ECV.circuitId ASC) Q2
    WHERE Q1.circuitId = Q2.circuitId
    `;
    let found: any = await this.sequelize.query(queryString, { type: QueryTypes.SELECT });
    return found;
  }

  public async getElectionInfoCountPerState(
    electionId: number,
    minAge: number,
    maxAge: number,
    gender: string
  ): Promise<any[]> {
    let minAgeFilter = minAge ? `AND TIMESTAMPDIFF(YEAR, V.birthday, CURDATE()) > ${minAge}` : ``;
    let maxAgeFilter = maxAge ? `AND TIMESTAMPDIFF(YEAR, V.birthday, CURDATE()) < ${maxAge}` : ``;
    let genderFilter = gender ? `AND V.gender = '${gender}'` : ``;
    let queryString: string = `
    SELECT  Q1.state, voters, votes
    FROM
    (SELECT C.state, Count(*) as voters
      FROM appEvDB.ElectionCircuitVoterSQLs ECV, appEvDB.CircuitSQLs C, appEvDB.VoterSQLs V
      WHERE ECV.electionId = 33622 AND ECV.circuitId = C.id AND ECV.voterCI = V.ci ${minAgeFilter} ${maxAgeFilter} ${genderFilter}
    GROUP BY C.state ORDER BY C.state ASC) Q1,
    (SELECT C.state, Count(*) as votes
      FROM appEvDB.ElectionCircuitVoterSQLs ECV, appEvDB.CircuitSQLs C, appEvDB.VoteSQLs Vo, appEvDB.VoterSQLs V
      WHERE ECV.electionId = 33622 AND ECV.circuitId = C.id AND ECV.voterCI = V.ci AND Vo.voterCI = V.ci ${minAgeFilter} ${maxAgeFilter} ${genderFilter}
    GROUP BY C.state ORDER BY C.state ASC) Q2
    WHERE Q1.state = Q2.state
    `;
    let found: any = await this.sequelize.query(queryString, { type: QueryTypes.SELECT });
    return found;
  }
}
