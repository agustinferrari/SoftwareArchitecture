import { Election, Voter } from "../../Common/Domain";

export interface IConsumer {
  getElections(includeVoters:boolean): Promise<Election[]>;
  getElection(id: number, includeVoters:boolean): Promise<Election>;
  getVoterPaginated(electionId: number, page: number, pageSize: number): Promise<Voter[]>;
}

