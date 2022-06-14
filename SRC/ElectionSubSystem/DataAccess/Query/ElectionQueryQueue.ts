import { ElectionInfo } from "../../../Common/Domain";
import Queue from "bull";
import { QueueJob, QueueJobPriority, QueueJobType, QueueResponse } from "../../../Common/Queues";
import config from "config";

export class ElectionQueryQueue {
  electionQueue: any;

  constructor() {
    this.electionQueue = new Queue<QueueJob>("sqlqueue", {
      redis: { port: config.get("REDIS.port"), host: config.get("REDIS.host") },
    });
  }

  public async getElectionsInfo(): Promise<ElectionInfo[]> {
    let queueJob = new QueueJob();
    queueJob.input = {};
    queueJob.priority = QueueJobPriority.GetElectionsInfo;
    queueJob.type = QueueJobType.GetElectionsInfo;
    let job = await this.electionQueue.add(queueJob);
    let result: QueueResponse = await job.finished();
    console.log("result:", result.result, " error:", result.error);
    return result.result;
  }

  public async getTotalVotes(electionId: number): Promise<number> {
    let queueJob = new QueueJob();
    queueJob.input = { electionId: electionId };
    queueJob.priority = QueueJobPriority.GetTotalVotes;
    queueJob.type = QueueJobType.GetTotalVotes;
    let job = await this.electionQueue.add(queueJob);
    let result: QueueResponse = await job.finished();
    console.log("result:", result.result, " error:", result.error);
    return result.result;
  }
  public async getCandidatesResult(electionId: number): Promise<any[]> {
    let queueJob = new QueueJob();
    queueJob.input = { electionId: electionId };
    queueJob.priority = QueueJobPriority.GetPartiesResult;
    queueJob.type = QueueJobType.GetCandidatesResult;

    let job = await this.electionQueue.add(queueJob);
    let result: QueueResponse = await job.finished();
    return result.result;
  }

  public async getPartiesResult(electionId: number): Promise<any[]> {
    let queueJob = new QueueJob();
    queueJob.input = { electionId: electionId };
    queueJob.priority = QueueJobPriority.GetPartiesResult;
    queueJob.type = QueueJobType.GetPartiesResult;

    let job = await this.electionQueue.add(queueJob);
    let result: QueueResponse = await job.finished();
    return result.result;
  }
}
