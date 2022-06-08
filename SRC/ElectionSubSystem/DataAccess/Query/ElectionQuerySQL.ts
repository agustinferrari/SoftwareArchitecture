import { Sequelize } from "sequelize-typescript";
import {
  Circuit,
  Election,
  Party,
  Voter,
  Candidate,
  ElectionInfo,
} from "../../../Common/Domain";

import {
  CandidateSQL,
  ElectionSQL,
  ElectionCircuitSQL,
  ElectionCircuitVoterSQL,
  PartySQL,
  VoterSQL,
  CircuitSQL,
  ElectionCandidateSQL,
} from "../../../Common/Models";
const { QueryTypes } = require('sequelize');

export class ElectionQuerySQL {

  sequelize : Sequelize;
  public constructor(sequelize: Sequelize){
    this.sequelize = sequelize;
  }

  public async getElectionsInfo(): Promise<ElectionInfo[]> {
    let found = await this.sequelize.query("SELECT id FROM appEvDB.ElectionSQLs;", { type: QueryTypes.SELECT });
    let result : ElectionInfo[] = [];
    if(found){
      for(let i =0 ;i< found.length ;i ++){
        let obj = {id:found[i]};
        let election : ElectionInfo = new ElectionInfo(obj);
        result.push(election);
      }
    }
    return result;
  }
 

}
