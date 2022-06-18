import { ElectionInfo } from "../../../Common/Domain";
import Queue from "bull";
import { QueueQueryJob, QueueQueryPriority, QueueQueryType, QueueResponse } from "../../../Common/Queues";
import config from "config";

export class ElectionQueryQueue {
  electionQueue: any;
  jobOptions: any;

  constructor() {
    this.electionQueue = new Queue<QueueQueryJob>(config.get("REDIS.queryQueue"), {
      redis: { port: config.get("REDIS.port"), host: config.get("REDIS.host") },
    });
    this.jobOptions = {
      removeOnComplete: true,
      removeOnFail: true,
    };
  }

  public async getElectionsInfo(): Promise<ElectionInfo[]> {
    let queueJob = new QueueQueryJob();
    queueJob.input = {};
    this.jobOptions.priority = QueueQueryPriority.GetElectionsInfo;
    queueJob.type = QueueQueryType.GetElectionsInfo;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    let result: QueueResponse = await job.finished();
    return result.result;
  }

  public async getTotalVotes(electionId: number): Promise<number> {
    let queueJob = new QueueQueryJob();
    queueJob.input = { electionId: electionId };
    this.jobOptions.priority = QueueQueryPriority.GetTotalVotes;
    queueJob.type = QueueQueryType.GetTotalVotes;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    let result: QueueResponse = await job.finished();
    return result.result;
  }

  public async getCandidatesResult(electionId: number): Promise<any[]> {
    let queueJob = new QueueQueryJob();
    queueJob.input = { electionId: electionId };
    this.jobOptions.priority = QueueQueryPriority.GetCandidatesResult;
    queueJob.type = QueueQueryType.GetCandidatesResult;

    let job = await this.electionQueue.add(queueJob);
    let result: QueueResponse = await job.finished();
    return result.result;
  }

  public async getPartiesResult(electionId: number): Promise<any[]> {
    let queueJob = new QueueQueryJob();
    queueJob.input = { electionId: electionId };
    this.jobOptions.priority = QueueQueryPriority.GetPartiesResult;
    queueJob.type = QueueQueryType.GetPartiesResult;

    let job = await this.electionQueue.add(queueJob);
    let result: QueueResponse = await job.finished();
    return result.result;
  }

  public async validateElectionVotesDate(electionId: number): Promise<boolean> {
    let queueJob = new QueueQueryJob();
    queueJob.input = { electionId: electionId };
    this.jobOptions.priority = QueueQueryPriority.ValidateElectionVotesDate;
    queueJob.type = QueueQueryType.ValidateElectionVotesDate;

    let job = await this.electionQueue.add(queueJob);
    let result: QueueResponse = await job.finished();
    return result.result;
  }

  public async validateElectionVotesCount(electionId: number): Promise<boolean> {
    let queueJob = new QueueQueryJob();
    queueJob.input = { electionId: electionId };
    this.jobOptions.priority = QueueQueryPriority.ValidateElectionVotesCount;
    queueJob.type = QueueQueryType.ValidateElectionVotesCount;

    let job = await this.electionQueue.add(queueJob);
    let result: QueueResponse = await job.finished();
    return result.result;
  }

  // public async getElectionResult(electionId: number): Promise<ElectionResult> {
  //   let queueJob = new QueueJob();
  //   queueJob.input = { electionId: electionId };
  //   this.jobOptions.priority = QueueJobPriority.GetElectionResult;
  //   queueJob.type = QueueJobType.GetElectionResult;
  //   let job = await this.electionQueue.add(queueJob, this.jobOptions);
  //   let result: QueueResponse = await job.finished();
  //   console.log("result:", result.result, " error:", result.error);
  //   return result.result;
  // }
}
