import { Election, Voter } from "../../../Common/Domain";
import Queue from "bull";
import { QueueQueryJob, QueueQueryPriority, QueueQueryType, QueueResponse, QueueCommandPriority, QueueCommandType, QueueCommandJob } from "../../../Common/Queues";
import config from "config";

export class ElectionCommandQueue {
  electionQueue: any;
  jobOptions: any;

  constructor() {
    this.electionQueue = new Queue<QueueQueryJob>(config.get("REDIS.commandQueue"), {
      redis: { port: config.get("REDIS.port"), host: config.get("REDIS.host") },
    });
    this.jobOptions = {
      removeOnComplete: true,
      removeOnFail: true,
    };
  }

  public async addElection(election: Election): Promise<void> {
    let queueJob = new QueueCommandJob();
    queueJob.input = election;
    this.jobOptions.priority = QueueCommandPriority.AddElection;
    queueJob.type = QueueCommandType.AddElection;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    let result: QueueResponse = await job.finished();
    console.log("result:", result.result, " error:", result.error);
  }

  public async addVoters(voters: Voter[], electionId: number): Promise<number> {
    let queueJob = new QueueCommandJob();
    let lengthReceived = voters.length;
    queueJob.input = { voters, electionId };
    this.jobOptions.priority = QueueCommandPriority.AddVoters;
    queueJob.type = QueueCommandType.AddVoters;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    voters.length = 0;
    voters = [];
    queueJob.input = {};
    let result: QueueResponse = await job.finished();
    console.log("result:", result.result, " error:", result.error);
    return lengthReceived;
  }

  public async deleteVoterCandidateAssociation(electionId: number){
    let queueJob = new QueueCommandJob();
    queueJob.input = { electionId };
    this.jobOptions.priority = QueueCommandPriority.DeleteVoterCandidateAssociation;
    queueJob.type = QueueCommandType.DeleteVoterCandidateAssociation;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    let result: QueueResponse = await job.finished();
    console.log("result:", result.result, " error:", result.error);
    return result.result;
  }
}
