import { Election, Voter } from "../../../Common/Domain";
import Queue from "bull";
import { QueueJob, QueueJobPriority, QueueJobType, QueueResponse } from "../../../Common/Queues";
import config from "config";

export class ElectionCommandQueue {
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

  public async addElection(election: Election): Promise<void> {
    let queueJob = new QueueJob();
    queueJob.input = election;
    queueJob.priority = QueueJobPriority.AddElection;
    queueJob.type = QueueJobType.AddElection;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    let result: QueueResponse = await job.finished();
    console.log("result:", result.result, " error:", result.error);
  }

  public async addVoters(voters: Voter[], electionId: number): Promise<number> {
    let queueJob = new QueueJob();
    let lengthReceived = voters.length;
    queueJob.input = { voters, electionId };
    queueJob.priority = QueueJobPriority.AddVoters;
    queueJob.type = QueueJobType.AddVoters;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    voters.length = 0;
    voters = [];
    queueJob.input = {};
    let result: QueueResponse = await job.finished();
    console.log("result:", result.result, " error:", result.error);
    return lengthReceived;
  }
}
