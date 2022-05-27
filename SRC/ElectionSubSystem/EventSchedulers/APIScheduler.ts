import { scheduleJob, RecurrenceRule } from "node-schedule";
import config from "config";
import { APIConsumer } from "../ElectoralConsumer/APIConsumer";
import { ElectionManager } from "../ElectionManager";

export class APIScheduler  {
  
    rule = new RecurrenceRule();
    consumer = new APIConsumer([]);
    manager = new ElectionManager();
    
    constructor() {
        this.rule.date = config.get("API.fetchDate.date");
        this.rule.hour = config.get("API.fetchDate.hour");
        this.rule.minute = config.get("API.fetchDate.minute");;
    }
    
    public startRecurrentGet = () => {
      console.log("api scheduled")
       scheduleJob(this.rule, () => {
        this.consumer.getElections().then((elections) => { this.manager.handleElections(elections)})
      })
    }

} 