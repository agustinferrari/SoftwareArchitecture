export class CandidateModel {
  constructor(personJSON: any) {
    this.ci = personJSON.ci;
    this.name = personJSON.name;
    this.lastName = personJSON.lastName;
  }
  ci: string;
  name: string;
  lastName: string;
}
