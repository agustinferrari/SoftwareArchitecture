import { ElectionInfo } from "../Common/Domain";
import { QuerySQL } from "./QuerySQL";

export class QueueTypeHandler {
  query: QuerySQL;
  constructor(query: QuerySQL) {
    this.query = query;
  }

  public async voterElectionCircuit(data: any): Promise<boolean> {
    //TODO ver si validar que no esten vacios
    return await this.query.voterElectionCircuit(data.voterCI, data.electionId, data.circuitId);
  }

  public async getElectionsInfo(data: any): Promise<ElectionInfo[]> {
    //TODO ver si validar que no esten vacios
    return await this.query.getElectionsInfo();
  }

  public async addElection(data: any): Promise<void> {
    //TODO ver si validar que no esten vacios
    return;
  }

  public async addVoters(data: any): Promise<void> {
    //TODO ver si validar que no esten vacios
    return;
  }
}
