import { PersonDTO } from "./PersonDTO";
export class VoterDTO extends PersonDTO {
  constructor(voterJSON: any) {
    super(voterJSON);
    this.residency = voterJSON.residency;
    this.circuitId = voterJSON.circuitId;
    this.phone = voterJSON.phone;
    this.email = voterJSON.email;
    this.credential = voterJSON.credential;
  }
  residency: string;
  circuitId: number;
  phone: string;
  email: string;
  credential: string;
}
