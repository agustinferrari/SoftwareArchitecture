import { Person } from "./Person";

export class Candidate extends Person {
  constructor(candidateJSON: any) {
    super(candidateJSON);
    this.partyId = candidateJSON.partyId;
  }
  partyId: number;
}
