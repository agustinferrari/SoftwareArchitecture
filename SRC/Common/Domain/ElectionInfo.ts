import { Candidate } from "./Candidate";
import { ElectionMode } from "./ElectionMode";

export class ElectionInfo {
  id: number;
  name: string;
  mode: ElectionMode;
  maxVotesPerVoter: number;
  maxVoteRecordRequestsPerVoter: number;
  emails: string[];
  candidateCIs: string[];
  startDate: string;
  endDate: string;
  voterCount: number;

  constructor(obj: any) {
    this.id = obj.id;
    this.name = obj.name;
    this.mode = obj.mode;
    this.maxVotesPerVoter = obj.maxVotesPerVoter ? obj.maxVotesPerVoter : 1;
    this.maxVoteRecordRequestsPerVoter = obj.maxVoteRecordRequestsPerVoter
      ? obj.maxVoteRecordRequestsPerVoter
      : 1;
    this.emails = obj.emails;
    if (obj.candidates) {
      this.candidateCIs = obj.candidates.map(
        (candidate: Candidate) => candidate.ci
      );
    } else if (obj.candidateCIs) {
      this.candidateCIs = [];
      for (let i = 0; i < obj.candidateCIs.length; i++) {
        let element = obj.candidateCIs[i];
        this.candidateCIs.push(element.toString());
      }
    } else {
      this.candidateCIs = [];
    }

    this.startDate = obj.startDate;
    this.endDate = obj.endDate;
    this.voterCount = 0;
  }

  setMaxVotes(maxVotesPerVoter: number) {
    this.maxVotesPerVoter = maxVotesPerVoter;
  }

  setMaxVoteRecordRequests(maxVoteRecordRequestsPerVoter: number) {
    this.maxVoteRecordRequestsPerVoter = maxVoteRecordRequestsPerVoter;
  }

  setEmails(emails: string[]) {
    this.emails = emails;
  }
}
