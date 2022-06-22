import { Schema } from "mongoose";
import { ElectionInfo } from "../../Common/Domain";

export const electionInfoSchema = new Schema<ElectionInfo>({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  mode: { type: String, required: true },
  maxVotesPerVoter: { type: Number, required: true },
  maxVoteRecordRequestsPerVoter: { type: Number, required: true },
  emails: [{ type: String, required: true }],
  candidateCIs: [{ type: String, required: true }],
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  voterCount: { type: Number, required: true },
});
