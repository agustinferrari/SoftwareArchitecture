export class CircuitDTO {
  constructor(inputJSON: any) {
    this.id = inputJSON.id;
    this.state = inputJSON.state;
    this.location = inputJSON.location;
  }
  id: number;
  state: string;
  location: string;
}
