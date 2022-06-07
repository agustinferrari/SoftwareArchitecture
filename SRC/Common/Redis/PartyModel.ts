import { Candidate } from "../Domain";
import { CandidateModel } from "./CandidateModel";

export class PartyModel {
  constructor(id: number, name: string, candidates: Candidate[]) {
    this.id = id;
    this.name = name;
    this.candidates = candidates.map((candidate: any) => {
      return new CandidateModel(candidate);
    });
  }
  id: number;
  name: string;
  candidates: CandidateModel[];
}
