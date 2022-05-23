import { scheduleJob, RecurrenceRule } from "node-schedule";
import config from "config";
import { APIConsumer } from "../ElectoralConsumer/APIConsumer";

export class APIScheduler {

    rule = new RecurrenceRule();
    consumer = new APIConsumer([]);
    
    constructor() {
        this.rule.date = config.get("API.fetchDate.date");
        this.rule.hour = config.get("API.fetchDate.hour");
        this.rule.minute = config.get("API.fetchDate.minute");;
    }
    
    public startRecurrentFetch = () => {
       scheduleJob(this.rule, () => {
        console.log("get");
        this.consumer.getElections().then((elections) => {console.log(elections)})
      })
    }

} 