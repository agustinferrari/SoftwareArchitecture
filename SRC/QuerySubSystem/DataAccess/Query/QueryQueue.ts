import { Vote, Voter } from "../../../Common/Domain";

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
    let job = await this.electionQueue.add(queueJob);
    let response: QueueResponse = await job.finished();
    if (!response.result) {
      throw new Error("The voter has not voted in this election");
    }
    console.log("result:", response.result, " error:", response.error);
    return response.result;
  }

  public async getVote(voteId: string, voterCI: string): Promise<Vote> {
    let queueJob = new QueueJob();
    queueJob.input = { voteId: voteId, voterCI: voterCI };
    queueJob.priority = QueueJobPriority.GetVote;
    queueJob.type = QueueJobType.GetVote;
    let job = await this.electionQueue.add(queueJob);
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
    let job = await this.electionQueue.add(queueJob);
    let response: QueueResponse = await job.finished();
    if (!response.result) {
      throw new Error("The election does not exist");
    }
    console.log("result:", response.result, " error:", response.error);
    return response.result;
  }
}
