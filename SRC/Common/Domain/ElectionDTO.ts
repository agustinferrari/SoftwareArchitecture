import { VoterDTO } from "./VoterDTO";
import { CandidateDTO } from "./CandidateDTO";
import { PartyDTO } from "./PartyDTO";
import { CircuitDTO } from "./CircuitDTO";

export class ElectionDTO {
  constructor(inputJson: any) {
    this.name = inputJson.name;
    this.id = inputJson.id;
    this.description = inputJson.description;
    this.startDate = inputJson.startDate;
    this.endDate = inputJson.endDate;
    this.mode = inputJson.mode;
    this.voters = inputJson.voters.map((voter: any) => {
      return new VoterDTO(voter);
    });
    this.candidates = inputJson.candidates.map((candidate: any) => {
      return new CandidateDTO(candidate);
    });
    this.parties = inputJson.parties.map((party: any) => {
      return new PartyDTO(party);
    });
    this.circuits = inputJson.circuits.map((circuit: any) => {
      return new CircuitDTO(circuit);
    });
  }


  name: string;
  id: number;
  description: string;
  startDate: string;
  endDate: string;
  mode: Enumerator;
  voters: VoterDTO[];
  candidates: CandidateDTO[];
  parties: PartyDTO[];
  circuits: CircuitDTO[];
}
