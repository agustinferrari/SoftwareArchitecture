import { Sequelize } from "sequelize-typescript";
import { ElectionInfo, Vote, Voter } from "../../../Common/Domain";
import { VoterSQL, VoteSQL } from "../../Models";

const { QueryTypes } = require("sequelize");

export class QuerySQL {
  sequelize: Sequelize;
  public constructor(sequelize: Sequelize) {
    this.sequelize = sequelize;
  }

  private validateString(value: string) {
    let regex = /^[a-zA-Z0-9 ]*$/;
    if (regex.test(value)) {
      return;
    }
    throw new Error("Invalid string characters");
  }

  public async getVoter(ci: string): Promise<Voter> {
    this.validateString(ci);
    let found = await VoterSQL.findByPk(ci);
    if (!found) {
      throw new Error("Voter not found");
    }
    let voter: Voter = new Voter(found);
    return voter;
  }

  public async getElectionsInfo(): Promise<ElectionInfo[]> {
    let found = await this.sequelize.query("SELECT * FROM appEvDB.ElectionSQLs;", {
      type: QueryTypes.SELECT,
    });
    console.log("found[i]");
    let result: ElectionInfo[] = [];
    if (found) {
      for (let i = 0; i < found.length; i++) {
        let obj = found[i] ;
        let election: ElectionInfo = new ElectionInfo(obj);
        result.push(election);
      }
    }
    return result;
  }

  public async voterElectionCircuit(voterCI: string, electionId: number, circuitId: number): Promise<boolean> {
    this.validateString(voterCI);
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
    this.validateString(voterCI);
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

  public async checkRepeatedVote(voterCI: string, electionId: number, maxVotesPerVoter: number): Promise<boolean> {
    this.validateString(voterCI);
    let queryString: string = `SELECT Count(*) as 'VoteCount' FROM appEvDB.VoteSQLs WHERE voterCI = '${voterCI}' 
                                    AND electionId = '${electionId}';`;
    let found = await this.sequelize.query(queryString, {
      type: QueryTypes.SELECT,
    });
    if (found[0]) {
      let isOverLimit = found[0]["VoteCount"] >= maxVotesPerVoter;
      return isOverLimit;
    } else {
      return false;
    }
  }

  public async getVoteDates(electionId: number, voterCI: string): Promise<string[]> {
    this.validateString(voterCI);
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
    this.validateString(voterCI);
    this.validateString(voteId);
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

  public async getVoteFrequency(electionId: number): Promise<any[]> {
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

  public async getCandidatesResult(electionId: number): Promise<any[]> {
    let queryString: string = ` SELECT candidateCI, CONCAT( C.name," ", C.lastName) AS 'fullName', 
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

  public async getPartiesResult(electionId: number): Promise<any[]> {
    let queryString: string = ` SELECT P.id AS "partyId", 
                                P.name AS 'partyName',
                                sum(EC.voteCount) as 'voteCount'
                                FROM appEvDB.ElectionCandidateSQLs EC, 
                                appEvDB.CandidateSQLs C,
                                appEvDB.PartySQLs P
                                where EC.electionId = ${electionId}
                                AND EC.candidateCI = C.ci
                                AND C.partyId = P.id
                                GROUP BY P.id , P.name
                                ORDER BY sum(EC.voteCount) DESC
                                `;
    let found = await this.sequelize.query(queryString, {
      type: QueryTypes.SELECT,
    });
    return found;
  }

  public async getElectionInfoCountPerCircuit(electionId: number, minAge: number, maxAge: number): Promise<any[]> {
    let minAgeFilter = minAge ? `AND TIMESTAMPDIFF(YEAR, V.birthday, CURDATE()) > ${minAge}` : ``;
    let maxAgeFilter = maxAge ? `AND TIMESTAMPDIFF(YEAR, V.birthday, CURDATE()) < ${maxAge}` : ``;
    let queryString: string = `
    SELECT  Q1.circuitId, voters, votes, Q1.age, Q1.gender
    FROM
    (SELECT ECV.circuitId, Count(V.ci) as voters, TIMESTAMPDIFF(YEAR, V.birthday, CURDATE()) as age, V.gender
      FROM appEvDB.ElectionCircuitVoterSQLs ECV, appEvDB.VoterSQLs V 
      WHERE ECV.electionId = ${electionId} AND ECV.voterCI = V.ci ${minAgeFilter} ${maxAgeFilter}
    GROUP BY circuitId, TIMESTAMPDIFF(YEAR, V.birthday, CURDATE()), V.gender ORDER BY ECV.circuitId ASC, TIMESTAMPDIFF(YEAR, V.birthday, CURDATE()) ASC) Q1,
    (SELECT ECV.circuitId, Count(V.ci) as votes, TIMESTAMPDIFF(YEAR, V.birthday, CURDATE()) as age, V.gender
      FROM appEvDB.ElectionCircuitVoterSQLs ECV, appEvDB.VoterSQLs V, appEvDB.VoteSQLs Vo
      WHERE ECV.electionId = ${electionId} AND ECV.voterCI = V.ci AND Vo.voterCI = V.ci ${minAgeFilter} ${maxAgeFilter}
      GROUP BY circuitId, TIMESTAMPDIFF(YEAR, V.birthday, CURDATE()), V.gender ORDER BY ECV.circuitId ASC, TIMESTAMPDIFF(YEAR, V.birthday, CURDATE()) ASC) Q2
      WHERE Q1.circuitId = Q2.circuitId AND Q1.age = Q2.age AND Q1.gender = Q2.gender
    `;
    let found: any = await this.sequelize.query(queryString, { type: QueryTypes.SELECT });
    return found;
  }

  public async getElectionInfoCountPerState(electionId: number, minAge: number | undefined, maxAge: number | undefined): Promise<any[]> {
    let minAgeFilter = minAge ? `AND TIMESTAMPDIFF(YEAR, V.birthday, CURDATE()) > ${minAge}` : ``;
    let maxAgeFilter = maxAge ? `AND TIMESTAMPDIFF(YEAR, V.birthday, CURDATE()) < ${maxAge}` : ``;
    let queryString: string = `
    SELECT  Q1.state as stateName, voters, votes, Q1.age, Q1.gender
    FROM
    (SELECT C.state, Count(*) as voters, TIMESTAMPDIFF(YEAR, V.birthday, CURDATE()) as age, V.gender
      FROM appEvDB.ElectionCircuitVoterSQLs ECV, appEvDB.CircuitSQLs C, appEvDB.VoterSQLs V
      WHERE ECV.electionId = ${electionId} AND ECV.circuitId = C.id AND ECV.voterCI = V.ci ${minAgeFilter} ${maxAgeFilter}
    GROUP BY C.state, TIMESTAMPDIFF(YEAR, V.birthday, CURDATE()), V.gender ORDER BY C.state ASC, TIMESTAMPDIFF(YEAR, V.birthday, CURDATE()) ASC) Q1,
    (SELECT C.state, Count(*) as votes, TIMESTAMPDIFF(YEAR, V.birthday, CURDATE()) as age, V.gender
      FROM appEvDB.ElectionCircuitVoterSQLs ECV, appEvDB.CircuitSQLs C, appEvDB.VoteSQLs Vo, appEvDB.VoterSQLs V
      WHERE ECV.electionId = ${electionId} AND ECV.circuitId = C.id AND ECV.voterCI = V.ci AND Vo.voterCI = V.ci ${minAgeFilter} ${maxAgeFilter}
    GROUP BY C.state, TIMESTAMPDIFF(YEAR, V.birthday, CURDATE()), V.gender ORDER BY C.state ASC, TIMESTAMPDIFF(YEAR, V.birthday, CURDATE()) ASC) Q2
    WHERE Q1.state = Q2.state AND Q1.age = Q2.age AND Q1.gender = Q2.gender
    `;
    let found: any = await this.sequelize.query(queryString, { type: QueryTypes.SELECT });
    return found;
  }

  public async getElectionInfo(electionId: number): Promise<any[]> {
    let candidates = await this.getCandidatesResult(electionId);
    let parties = await this.getPartiesResult(electionId);
    let totalVotes = await this.getTotalVotes(electionId);
    let responseState = await this.getElectionInfoCountPerState(electionId, undefined, undefined);
    return [totalVotes, candidates, parties, responseState];
  }

  public async validateElectionVotesDate(electionId: number): Promise<boolean> {
    let queryString: string = `SELECT MAX(V.startTimestamp)<=E.endDate FROM appEvDB.VoteSQLs V, appEvDB.ElectionSQLs E 
                                  WHERE E.id = V.electionId AND V.electionId = ${electionId};`;
    let found = await this.sequelize.query(queryString, {
      type: QueryTypes.SELECT,
    });
    return found[0] == 1;
  }

  public async validateElectionVotesCount(electionId: number): Promise<boolean> {
    let queryString: string = `SELECT Q1.voteCount <= Q2.voterCount  FROM
                                (SELECT COUNT(*) as "voteCount" FROM appEvDB.ElectionCandidateSQLs WHERE electionId = ${electionId} GROUP BY electionId) Q1, 
                                (SELECT COUNT(*) as "voterCount" FROM appEvDB.ElectionCircuitVoterSQLs WHERE electionId = ${electionId} GROUP BY electionId) Q2`;
    let found = await this.sequelize.query(queryString, {
      type: QueryTypes.SELECT,
    });
    return found[0] == 1;
  }

  public async getElectionCandidates(electionId: number): Promise<any[]> {
    let queryString: string = ` SELECT C.name, C.ci, C.lastName, C.birthday, C.gender, C.partyId 
                                FROM appEvDB.CandidateSQLs C, appEvDB.ElectionCandidateSQLs EC
                                WHERE EC.electionId = ${electionId} AND C.ci = EC.candidateCI
                                `;
    let found = await this.sequelize.query(queryString, {
      type: QueryTypes.SELECT,
    });
    return found;
  }

  public async getElectionParties(electionId: number): Promise<any[]> {
    let queryString: string = ` SELECT P.id, P.name 
                                FROM appEvDB.PartySQLs P, appEvDB.ElectionCandidateSQLs EC, appEvDB.CandidateSQLs C
                                WHERE P.id = C.partyId AND EC.candidateCI = C.ci AND EC.electionId = ${electionId}
                                GROUP BY P.id, P.Name;
                                `;
    let found = await this.sequelize.query(queryString, {
      type: QueryTypes.SELECT,
    });
    return found;
  }
}
