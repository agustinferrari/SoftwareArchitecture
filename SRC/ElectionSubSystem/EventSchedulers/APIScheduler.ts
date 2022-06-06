import { scheduleJob, RecurrenceRule } from "node-schedule";
import config from "config";
import { ElectionManager } from "../ElectionManager";
import { IConsumer } from "../ElectoralConsumer/IConsumer";

export class APIScheduler {
  rule: RecurrenceRule;
  consumer: IConsumer;
  manager: ElectionManager;

  constructor(consumer: IConsumer, electionManager: ElectionManager) {
    this.rule = new RecurrenceRule();
    this.consumer = consumer;
    this.manager = electionManager;
    this.rule.date = config.get("API.fetchDate.date");
    this.rule.hour = config.get("API.fetchDate.hour");
    this.rule.minute = config.get("API.fetchDate.minute");
    
    let includeVoters: boolean = true;
    this.consumer.getElections(includeVoters).then((elections) => {
      this.manager.handleElections(elections);
    });
  }

  public startRecurrentGet = () => {
    console.log("api scheduled");
    scheduleJob(this.rule, () => {
      let includeVoters: boolean = true;
      this.consumer.getElections(includeVoters).then((elections) => {
        this.manager.handleElections(elections);
      });
    });
  };
}
