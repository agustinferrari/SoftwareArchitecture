import { Voter } from "../../../Common/Domain";

import Queue from "bull";
import { QueueJob, QueueJobPriority, QueueJobType, QueueResponse } from "../../../Common/Queues";
import config from "config";

export class QueryQueue {
  electionQueue: any;

  constructor() {
    this.electionQueue = new Queue<QueueJob>("sqlqueue", {
      redis: { port: config.get("REDIS.port"), host: config.get("REDIS.host") },
    });
  }

  public async getVotes(electionId: number, voterCI: string): Promise<string[]> {
    let queueJob = new QueueJob();
    queueJob.input = { electionId: electionId, voterCI: voterCI };
    queueJob.priority = QueueJobPriority.GetVoter;
    queueJob.type = QueueJobType.GetVoter;
    let job = await this.electionQueue.add(queueJob);
    let response: QueueResponse = await job.finished();
    if (!response.result) {
      throw new Error("The voter has not voted in this election");
    }
    console.log("result:", response.result, " error:", response.error);
    return response.result;
  }
}
