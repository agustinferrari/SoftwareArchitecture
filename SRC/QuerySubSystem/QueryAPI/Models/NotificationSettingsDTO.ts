export class NotificationSettingsDTO {
  electionId: number;
  maxVotesPerVoter: number;
  maxVoteReportRequestsPerVoter: number;
  emailsSubscribed: string[];

  constructor(
    electionId: number,
    maxVotesPerVoter: number,
    maxVoteReportRequestsPerVoter: number,
    emailsSubscribed: string[]
  ) {
    this.electionId = electionId;
    this.maxVotesPerVoter = maxVotesPerVoter;
    this.maxVoteReportRequestsPerVoter = maxVoteReportRequestsPerVoter;
    this.emailsSubscribed = emailsSubscribed;
  }
}
