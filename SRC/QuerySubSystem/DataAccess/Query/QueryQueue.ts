import { Vote, Voter } from "../../../Common/Domain";

import Queue from "bull";
import { QueueJob, QueueJobPriority, QueueJobType, QueueResponse } from "../../../Common/Queues";
import config from "config";

export class QueryQueue {
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

  public async getVoter(ci: string): Promise<Voter> {
    let queueJob = new QueueJob();
    queueJob.input = { ci: ci };
    queueJob.priority = QueueJobPriority.GetVoter;
    queueJob.type = QueueJobType.GetVoter;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    let response: QueueResponse = await job.finished();
    if (!response.result) {
      throw new Error("Voter not found");
    }
    console.log("result:", response.result.ci, " error:", response.error);
    let voter: Voter = new Voter(response.result);
    return voter;
  }

  public async getVotes(electionId: number, voterCI: string): Promise<string[]> {
    let queueJob = new QueueJob();
    queueJob.input = { electionId: electionId, voterCI: voterCI };
    queueJob.priority = QueueJobPriority.GetVoteDates;
    queueJob.type = QueueJobType.GetVoteDates;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    let response: QueueResponse = await job.finished();
    if (!response.result) {
      throw new Error("The voter has not voted in this election");
    }
    return response.result;
  }

  public async getVote(voteId: string, voterCI: string): Promise<Vote> {
    let queueJob = new QueueJob();
    queueJob.input = { voteId: voteId, voterCI: voterCI };
    queueJob.priority = QueueJobPriority.GetVote;
    queueJob.type = QueueJobType.GetVote;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    let response: QueueResponse = await job.finished();
    if (!response.result) {
      throw new Error("The voter has not voted in this election");
    }
    console.log("result:", response.result.id, " error:", response.error);
    return response.result;
  }

  public async getVoteFrequency(electionId: any): Promise<string[]> {
    let queueJob = new QueueJob();
    queueJob.input = { electionId: electionId };
    queueJob.priority = QueueJobPriority.GetVoteFrequency;
    queueJob.type = QueueJobType.GetVoteFrequency;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    let response: QueueResponse = await job.finished();
    if (!response.result) {
      throw new Error("The election does not exist");
    }
    return response.result;
  }

  public async getElectionInfoCountPerCircuit(
    electionId: number,
    minAge: number,
    maxAge: number,
    gender: string
  ): Promise<any[]> {
    let queueJob = new QueueJob();
    queueJob.input = {
      electionId: electionId,
      minAge: minAge,
      maxAge: maxAge,
      gender: gender,
    };
    queueJob.priority = QueueJobPriority.GetElectionInfoCountPerCircuit;
    queueJob.type = QueueJobType.GetElectionInfoCountPerCircuit;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    let response: QueueResponse = await job.finished();
    return response.result;
  }

  public async getElectionInfoCountPerState(
    electionId: number,
    minAge: number,
    maxAge: number,
    gender: string
  ): Promise<any[]> {
    let queueJob = new QueueJob();
    queueJob.input = {
      electionId: electionId,
      minAge: minAge,
      maxAge: maxAge,
      gender: gender,
    };
    queueJob.priority = QueueJobPriority.GetElectionInfoCountPerState;
    queueJob.type = QueueJobType.GetElectionInfoCountPerState;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    let response: QueueResponse = await job.finished();
    return response.result;
  }

  public async getElectionInfo(electionId: number): Promise<any[]> {
    let queueJob = new QueueJob();
    queueJob.input = { electionId: electionId };
    queueJob.priority = QueueJobPriority.GetElectionInfo;
    queueJob.type = QueueJobType.GetElectionInfo;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    let response: QueueResponse = await job.finished();
    if (!response.result) {
      throw new Error("The election does not exist");
    }
    return response.result;
  }
}
