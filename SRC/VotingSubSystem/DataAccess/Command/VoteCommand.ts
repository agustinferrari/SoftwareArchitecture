import { VoteCommandQueue } from "./VoteCommandQueue";
import { VoteIntent } from "../../Models/VoteIntent";
import { Vote, ElectionMode } from "../../../Common/Domain";
export class VoteCommand {
  voteCommandQueue: VoteCommandQueue;

  constructor(voteCommandQueue: VoteCommandQueue) {
    this.voteCommandQueue = voteCommandQueue;
  }

  public async addVote(vote: Vote, mode: ElectionMode): Promise<void> {
    return this.voteCommandQueue.addVote(vote, mode);
  }
}
