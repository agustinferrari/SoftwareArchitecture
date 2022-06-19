import { Election, Vote, Voter, ElectionMode } from "../../../Common/Domain";
import Queue from "bull";
import { QueueQueryJob, QueueQueryPriority, QueueQueryType, QueueResponse, QueueCommandPriority, QueueCommandJob, QueueCommandType } from "../../../Common/Queues";
import config from "config";
import { VoteIntent } from "../../VotingAPI/Models/VoteIntent";
import { RequestCountHelper } from "../../Helpers/RequestCountHelper";

export class VoteCommandQueue {
  electionQueue: any;
  jobOptions: any;
  static countReq :number;
  constructor() {
    this.electionQueue = new Queue<QueueCommandJob>(config.get("REDIS.commandQueue"), {
      redis: { port: config.get("REDIS.port"), host: config.get("REDIS.host") },
    });
    this.jobOptions = {
      // removeOnComplete: true
      // removeOnFail: true,
    };
  }

  public async addVote(vote: Vote, mode: ElectionMode): Promise<void> {
    let reqCountHelper = RequestCountHelper.getInstance();
    reqCountHelper.beforeCommandQueueCount++;


    let queueJob = new QueueCommandJob();
    queueJob.input = { vote, mode };
    this.jobOptions.priority = QueueCommandPriority.AddVote;
    queueJob.type = QueueCommandType.AddVote;
    let job = await this.electionQueue.add(queueJob, this.jobOptions);
    let result: QueueResponse = await job.finished();

    reqCountHelper.afterCommandQueueCount++;
  }
}
