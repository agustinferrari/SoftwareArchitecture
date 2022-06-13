import { Document, Schema } from "mongoose";

export interface IVoteProofLog extends Document {
  voterCI: string;
  electionId:number;
  timestamp: Date;
  statusRejected: boolean; 
}


export const voteProofSchema = new Schema<IVoteProofLog>({
  voterCI: { type: String, required: true },
  timestamp: { type: Date, required: true },
  electionId: { type: Number, required: true },
  statusRejected: {type:Boolean,required:true}
});
