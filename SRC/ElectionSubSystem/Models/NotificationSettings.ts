import { Document, Schema } from "mongoose";

export interface INotificationSettings extends Document {
  electionId: number;
  maxVotesPerVoter: number;
  maxVoteReportRequestsPerVoter: number;
  emailsSubscribed: string[];
}

export class NotificationSettings {
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

export const notificationSettingsSchema = new Schema<INotificationSettings>({
  electionId: { type: Number, required: true },
  maxVotesPerVoter: { type: Number, required: true },
  maxVoteReportRequestsPerVoter: { type: Number, required: true },
  emailsSubscribed: { type: [String], required: true },
});
