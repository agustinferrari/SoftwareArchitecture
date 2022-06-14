import { ElectionInfo } from "../../../Common/Domain";
import Queue from "bull";
import { QueueJob, QueueJobPriority, QueueJobType, QueueResponse } from "../../../Common/Queues";
import config from "config";

export class ElectionQueryQueue {
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

  public async getElectionsInfo(): Promise<ElectionInfo[]> {
    let queueJob = new QueueJob();
    queueJob.input = {};
    queueJob.priority = QueueJobPriority.GetElectionsInfo;
    queueJob.type = QueueJobType.GetElectionsInfo;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    let result: QueueResponse = await job.finished();
    console.log("result:", result.result, " error:", result.error);
    return result.result;
  }

  public async getTotalVotes(electionId: number): Promise<number> {
    let queueJob = new QueueJob();
    queueJob.input = { electionId: electionId };
    queueJob.priority = QueueJobPriority.GetTotalVotes;
    queueJob.type = QueueJobType.GetTotalVotes;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    let result: QueueResponse = await job.finished();
    console.log("result:", result.result, " error:", result.error);
    return result.result;
  }
  // public async getElectionResult(electionId: number): Promise<ElectionResult> {
  //   let queueJob = new QueueJob();
  //   queueJob.input = { electionId: electionId };
  //   queueJob.priority = QueueJobPriority.GetElectionResult;
  //   queueJob.type = QueueJobType.GetElectionResult;
  //   let job = await this.electionQueue.add(queueJob, this.jobOptions);
  //   let result: QueueResponse = await job.finished();
  //   console.log("result:", result.result, " error:", result.error);
  //   return result.result;
  // }
}
