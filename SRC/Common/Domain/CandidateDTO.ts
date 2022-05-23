import { PersonDTO } from "./PersonDTO";

export class CandidateDTO extends PersonDTO {
  constructor(candidateJSON: any) {
    super(candidateJSON);
    this.partyId = candidateJSON.partyId;
  }
  partyId: number;
}
