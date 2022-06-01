import { ElectionDTO, VoterDTO } from "../../Common/Domain";

export interface IConsumer {
  getElections(includeVoters:boolean): Promise<ElectionDTO[]>;
  getElection(id: number, includeVoters:boolean): Promise<ElectionDTO>;
  getVoterPaginated(electionId: number, page: number, pageSize: number): Promise<VoterDTO[]>;
}

