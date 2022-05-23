import { Election } from "../Models";

export class ElectionModel {
  constructor(id: number, name: string, inProgress: boolean) {
    this.id = id;
    this.name = name;
    this.inProgress = inProgress;
  }
  id: number;
  name: string;
  inProgress: boolean;

  toModel(election: Election, inProgress: boolean) {
    this.id = election.id;
    this.name = election.name;
    this.inProgress = inProgress;
  }
}
