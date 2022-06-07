import { Candidate, Election, Party } from "../Domain";
import { ElectionSQL } from "../Models";
import { CandidateModel } from "./CandidateModel";
import { PartyModel } from "./PartyModel";

export class ElectionModel {
  constructor(jsonobject: any);
  constructor(jsonobject: Election);

  constructor(jsonObject: any | Election) {
    this.id = jsonObject.id;
    this.name = jsonObject.name;
    this.inProgress = jsonObject.inProgress;
    this.startDate = jsonObject.startDate;
    this.endDate = jsonObject.endDate;
    this.parties = jsonObject.parties;
    this.voterCount = jsonObject.votercount;
    this.mode = jsonObject.mode;

    if (jsonObject instanceof Election) {

      let currentDate = new Date();
      let started: boolean = new Date(jsonObject.startDate) < currentDate;
      let ended: boolean = new Date(jsonObject.endDate) < currentDate;
      this.inProgress = started && !ended;

      this.startDate = new Date(jsonObject.startDate);
      this.endDate = new Date(jsonObject.startDate);
      this.parties = jsonObject.parties.map((party: Party) => {
        let candidateList = jsonObject.candidates.filter((c: Candidate) => {
          return c.partyId == party.id;
        });
        return new PartyModel(party.id, party.name, candidateList);
      });
      return;
    }
  }
  id: number;
  name: string;
  inProgress: boolean;
  startDate: Date;
  endDate: Date;
  voterCount: number;
  parties: PartyModel[];
  mode: Enumerator;

  toModel(election: ElectionSQL, inProgress: boolean) {
    this.id = election.id;
    this.name = election.name;
    this.inProgress = inProgress;
  }
}
