export class ElectionNotFound extends Error {
  electionId: number;
  constructor(electionId: number) {
    super("Election " + electionId + " not found");
    this.electionId = electionId;
  }
}
