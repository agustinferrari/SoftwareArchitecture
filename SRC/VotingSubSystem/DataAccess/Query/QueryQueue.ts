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

  public async getVoter(ci: string): Promise<Voter> {
    let queueJob = new QueueJob();
    queueJob.input = { ci: ci };
    queueJob.priority = QueueJobPriority.GetVoter;
    queueJob.type = QueueJobType.GetVoter;
    let job = await this.electionQueue.add(queueJob);
    let result: QueueResponse = await job.finished();
    if (!result.result) {
      throw new Error("Voter not found");
    }
    let voter: Voter = new Voter(result.result);
    return voter;
  }
}
