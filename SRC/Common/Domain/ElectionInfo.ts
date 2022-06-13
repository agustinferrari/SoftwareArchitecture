import { Candidate } from "./Candidate";
import { ElectionMode } from "./ElectionMode";

export class ElectionInfo {
  constructor(obj: any) {
    this.id = obj.id;
    this.mode = obj.mode;
    this.maxVotesPerVoter = 1;
    this.maxVoteRecordRequestsPerVoter = 1;
    this.emails = obj.emails;
    this.candidateCIs = obj.candidates.map((candidate: Candidate) => candidate.ci);
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

  id: number;
  mode: ElectionMode;
  maxVotesPerVoter: number;
  maxVoteRecordRequestsPerVoter: number;
  emails: string[];
  candidateCIs: string[];
}
