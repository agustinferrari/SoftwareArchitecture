export class PartyDTO {
  constructor(inputJSON: any) {
    this.id = inputJSON.id;
    this.name = inputJSON.name;
  }
  id: number;
  name: string;
}
