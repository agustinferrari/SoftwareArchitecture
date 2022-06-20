import { Voter } from "./Voter";
import { Candidate } from "./Candidate";
import { Party } from "./Party";
import { Circuit } from "./Circuit";
import { ElectionMode } from "./ElectionMode";
import { ElectionInfo } from "./ElectionInfo";

export class Election {
  name: string;
  id: number;
  description: string;
  startDate: string;
  endDate: string;
  mode: ElectionMode;
  voters: Voter[];
  candidates: Candidate[];
  parties: Party[];
  circuits: Circuit[];
  emails: string[];

  parseElection(electionInfo: ElectionInfo): Election {
    return new Election({
      name: electionInfo.name,
      id: electionInfo.id,
      startDate: electionInfo.startDate,
      endDate: electionInfo.endDate,
      mode: electionInfo.mode,
      voters: [],
      emails: electionInfo.emails,
      candidates: [],
      parties: [],
      circuits: [],
    });
  }

  constructor(inputJson: any) {
    this.name = inputJson.name;
    this.id = inputJson.id;
    this.description = inputJson.description;
    this.startDate = inputJson.startDate;
    this.endDate = inputJson.endDate;
    this.mode = inputJson.mode;
    this.voters = [];
    this.emails = inputJson.emails;

    if (inputJson.voters) {
      this.voters = inputJson.voters.map((voter: any) => {
        return new Voter(voter);
      });
    }

    this.candidates = inputJson.candidates.map((candidate: any) => {
      return new Candidate(candidate);
    });
    this.parties = inputJson.parties.map((party: any) => {
      return new Party(party);
    });
    this.circuits = inputJson.circuits.map((circuit: any) => {
      return new Circuit(circuit);
    });
  }
}
