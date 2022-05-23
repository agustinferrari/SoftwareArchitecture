import { ElectionDTO } from "../../Common/Domain";

export interface IConsumer {
  getElections(): Promise<ElectionDTO[]>;
  getElection(id: number): Promise<ElectionDTO>;
}
