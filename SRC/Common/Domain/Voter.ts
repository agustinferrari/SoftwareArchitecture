import { Person } from "./Person";
export class Voter extends Person {
  constructor(voterJSON: any) {
    super(voterJSON);
    this.residency = voterJSON.residency;
    this.circuitId = voterJSON.circuitId;
    this.phone = voterJSON.phone;
    this.email = voterJSON.email;
    this.credential = voterJSON.credential;
    this.publicKey = voterJSON.publicKey
  }
  residency: string;
  circuitId: number;
  phone: string;
  email: string;
  credential: string;
  publicKey: string;
}

