import {ElectionDTO} from '../Domain/ElectionDTO';

export interface IConsumer {
  getElections() : Promise<ElectionDTO[]>;
  getElection(id: number): Promise<ElectionDTO>;
}

