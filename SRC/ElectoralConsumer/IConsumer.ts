import {Election} from './../Domain/Election';

export interface IConsumer {
  getElections() : Promise<Election[]>;
  getElection(id: number): Promise<Election>;
}

