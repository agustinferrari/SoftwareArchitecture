import { Voter } from "../../../Common/Domain";

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
      attempts: 10
    };
  }

  public async getVoter(ci: string): Promise<Voter> {
    let queueJob = new QueueJob();
    queueJob.input = { ci: ci };
    queueJob.type = QueueJobType.GetVoter;
    
    this.jobOptions.priority = QueueJobPriority.GetVoter;

    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    let response: QueueResponse = await job.finished();
    if (!response.result) {
      throw new Error("Voter not found");
    }
    console.log("result:", response.result.ci, " error:", response.error);
    let voter: Voter = new Voter(response.result);
    return voter;
  }

  public async voterElectionCircuit(
    voterCI: string,
    electionId: number,
    circuitId: number
  ): Promise<boolean> {
    let queueJob = new QueueJob();
    queueJob.input = { voterCI: voterCI, electionId: electionId, circuitId: circuitId };
    this.jobOptions.priority = QueueJobPriority.ValidateVoterElectionCircuit;
    queueJob.type = QueueJobType.ValidateVoterElectionCircuit;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    let response: QueueResponse = await job.finished();
    if (!response.result) {
      throw new Error(
        `Voter ${voterCI} not registered for election ${electionId} in circuit ${circuitId}`
      );
    }
    console.log("result:", response.result, " error:", response.error);
    return response.result;
  }

  public async checkUniqueVote(voterCI: string, electionId: number): Promise<boolean> {
    let queueJob = new QueueJob();
    queueJob.input = { voterCI: voterCI, electionId: electionId };
    this.jobOptions.priority = QueueJobPriority.ValidateOneVote;
    queueJob.type = QueueJobType.ValidateOneVote;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    let response: QueueResponse = await job.finished();
    return response.result;
  }

  public async checkRepeatedVote(
    voterCI: string,
    electionId: number,
    maxRepeatedVotes: number
  ): Promise<boolean> {
    let queueJob = new QueueJob();
    queueJob.input = {
      voterCI: voterCI,
      electionId: electionId,
      maxVotesPerVoter: maxRepeatedVotes,
    };
    this.jobOptions.priority = QueueJobPriority.ValidateRepeatedVote;
    queueJob.type = QueueJobType.ValidateRepeatedVote;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    let response: QueueResponse = await job.finished();
    return response.result;
  }
}
