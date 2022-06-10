import { ElectionInfo } from "../Common/Domain";
import { CommandSQL } from "./CommandSQL";
import { QuerySQL } from "./QuerySQL";

export class QueueTypeHandler {
  query: QuerySQL;
  command: CommandSQL;
  constructor(query: QuerySQL, command: CommandSQL) {
    this.query = query;
    this.command = command;
  }

  public async voterElectionCircuit(input: any): Promise<boolean> {
    //TODO ver si validar que no esten vacios
    return await this.query.voterElectionCircuit(input.voterCI, input.electionId, input.circuitId);
  }

  public async getElectionsInfo(input: any): Promise<ElectionInfo[]> {
    //TODO ver si validar que no esten vacios
    return await this.query.getElectionsInfo();
  }

  public async addElection(input: any): Promise<string> {
    //TODO ver si validar que no esten vacios
    await this.command.addElection(input);
    return "Added sucessfully";
  }

  public async addVoters(input: any): Promise<string> {
    //TODO ver si validar que no esten vacios
    await this.command.addVoters(input.voters, input.electionId);
    return "Added sucessfully";
  }
}
