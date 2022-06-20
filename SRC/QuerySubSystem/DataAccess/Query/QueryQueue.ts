import { Vote, Voter } from "../../../Common/Domain";

import Queue from "bull";
import { QueueQueryJob, QueueQueryPriority, QueueQueryType, QueueResponse } from "../../../Common/Queues";
import config from "config";

export class QueryQueue {
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

  public async getVoter(ci: string): Promise<Voter> {
    let queueJob = new QueueQueryJob();
    queueJob.input = { ci: ci };
    this.jobOptions.priority = QueueQueryPriority.GetVoter;
    queueJob.type = QueueQueryType.GetVoter;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    let response: QueueResponse = await job.finished();
    if (!response.result) {
      throw new Error("Voter not found");
    }
    let voter: Voter = new Voter(response.result);
    return voter;
  }

  public async getVotes(electionId: number, voterCI: string): Promise<string[]> {
    let queueJob = new QueueQueryJob();
    queueJob.input = { electionId: electionId, voterCI: voterCI };
    this.jobOptions.priority = QueueQueryPriority.GetVoteDates;
    queueJob.type = QueueQueryType.GetVoteDates;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    let response: QueueResponse = await job.finished();
    if (!response.result) {
      throw new Error("The voter has not voted in this election");
    }
    return response.result;
  }

  public async getVote(voteId: string, voterCI: string): Promise<Vote> {
    let queueJob = new QueueQueryJob();
    queueJob.input = { voteId: voteId, voterCI: voterCI };
    this.jobOptions.priority = QueueQueryPriority.GetVote;
    queueJob.type = QueueQueryType.GetVote;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    let response: QueueResponse = await job.finished();
    if (!response.result) {
      throw new Error("The voter has not voted in this election");
    }
    return response.result;
  }

  public async getVoteFrequency(electionId: any): Promise<string[]> {
    let queueJob = new QueueQueryJob();
    queueJob.input = { electionId: electionId };
    this.jobOptions.priority = QueueQueryPriority.GetVoteFrequency;
    queueJob.type = QueueQueryType.GetVoteFrequency;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    let response: QueueResponse = await job.finished();
    if (!response.result) {
      throw new Error("The election does not exist");
    }
    return response.result;
  }

  public async getElectionInfoCountPerCircuit(electionId: number, minAge: number, maxAge: number): Promise<any[]> {
    let queueJob = new QueueQueryJob();
    queueJob.input = {
      electionId: electionId,
      minAge: minAge,
      maxAge: maxAge,
    };
    this.jobOptions.priority = QueueQueryPriority.GetElectionInfoCountPerCircuit;
    queueJob.type = QueueQueryType.GetElectionInfoCountPerCircuit;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    let response: QueueResponse = await job.finished();
    return response.result;
  }

  public async getElectionInfoCountPerState(electionId: number, minAge: number, maxAge: number): Promise<any[]> {
    let queueJob = new QueueQueryJob();
    queueJob.input = {
      electionId: electionId,
      minAge: minAge,
      maxAge: maxAge,
    };
    this.jobOptions.priority = QueueQueryPriority.GetElectionInfoCountPerState;
    queueJob.type = QueueQueryType.GetElectionInfoCountPerState;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    let response: QueueResponse = await job.finished();
    return response.result;
  }

  public async getElectionInfo(electionId: number): Promise<any[]> {
    let queueJob = new QueueQueryJob();
    queueJob.input = { electionId: electionId };
    this.jobOptions.priority = QueueQueryPriority.GetElectionInfo;
    queueJob.type = QueueQueryType.GetElectionInfo;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    let response: QueueResponse = await job.finished();
    if (!response.result) {
      throw new Error("The election does not exist");
    }
    return response.result;
  }
}
