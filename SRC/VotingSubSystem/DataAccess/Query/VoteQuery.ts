import { Voter } from "../../../Common/Domain";
import { VoterQueryQueue } from "./VoterQueryQueue";

export class VoterQuery {
  voterQueryQueue: VoterQueryQueue;

  constructor(voterQuerySQL: VoterQueryQueue) {
    this.voterQueryQueue = voterQuerySQL;
  }

  public async getVoter(ci: string): Promise<Voter> {
    let found: Voter = await this.voterQueryQueue.getVoter(ci);
    return found;
  }
}
