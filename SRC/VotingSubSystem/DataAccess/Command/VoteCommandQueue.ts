import { Election, Vote, Voter, ElectionMode } from "../../../Common/Domain";
import Queue from "bull";
import { QueueJob, QueueJobPriority, QueueJobType, QueueResponse } from "../../../Common/Queues";
import config from "config";
import { VoteIntent } from "../../Models/VoteIntent";

export class VoteCommandQueue {
  electionQueue: any;
  jobOptions: any;

  constructor() {
    this.electionQueue = new Queue<QueueJob>("sqlqueue", {
      redis: { port: config.get("REDIS.port"), host: config.get("REDIS.host") },
    });
    this.jobOptions = {
      removeOnComplete: true,
      removeOnFail: true,
    };
  }

  public async addVote(vote: Vote, mode: ElectionMode): Promise<void> {
    let queueJob = new QueueJob();
    queueJob.input = { vote, mode };
    this.jobOptions.priority = QueueJobPriority.AddVote;
    queueJob.type = QueueJobType.AddVote;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    let result: QueueResponse = await job.finished();
    console.log("result:", result.result, " error:", result.error);
  }
}
