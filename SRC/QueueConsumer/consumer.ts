import {} from "../Common/Domain";
import { SequelizeContext } from "../Common/Models";
import Queue from "bull";
import config from "config";
import { QueueJob, QueueResponse } from "../Common/Queues";
import { QuerySQL } from "./QuerySQL";
import { QueueTypeHandler } from "./QueueTypeHandler";

let context: SequelizeContext = new SequelizeContext();
(async () => {
  context.addModels();
  context.syncAllModels();
})();

const query = new QuerySQL(context.connection);
const queueTypeHandler = new QueueTypeHandler(query);

//Consumidor

const queue = new Queue<QueueJob>("sqlqueue", {
  redis: { port: config.get("REDIS.port"), host: config.get("REDIS.host") },
});

async function consumer() {
  console.log("Consumer started");
  queue.process(async function (job, done) {
    let type = job.data.type;
    let input = job.data.input;
    console.log("Received job:", type);
    console.log("Job input:", input);
    let response: QueueResponse = new QueueResponse();
    let result = null;
    try {
      result = await queueTypeHandler[type](input);
    } catch (e: any) {
      response.error = e.message;
    }
    response.result = result;

    done(null, response);
  });
}

(async () => {
  consumer();
})();
