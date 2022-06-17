import {} from "../Common/Domain";
import { SequelizeContext } from "./Models";
import Queue from "bull";
import config from "config";
import { QueueJob, QueueResponse } from "../Common/Queues";
import { QuerySQL } from "./QuerySQL";
import { QueueTypeHandler } from "./QueueTypeHandler";
import { CommandSQL } from "./CommandSQL";


let pm2id : string | undefined = process.env.pm_id;
let MySQLPort;
if(pm2id) {
  let id = parseInt(pm2id)
  let ports : string[] = config.get("SQL_DB.ports");
  let MySQLPort = ports[id%ports.length];
  console.log("MySQLPort:", MySQLPort);
}
let context: SequelizeContext = new SequelizeContext(MySQLPort);

const query = new QuerySQL(context.connection);
const command = new CommandSQL();
const queueTypeHandler = new QueueTypeHandler(query, command);

//Consumidor

const queue = new Queue<QueueJob>("sqlqueue", {
  redis: { port: config.get("REDIS.port"), host: config.get("REDIS.host") },
});

async function consumer() {
  console.log("Consumer started");
  queue.process(100, async function (job, done) {
    let type = job.data.type;
    let input = job.data.input;
    console.log("Received job:", type);
    //console.log("Job input:", input);
    console.log("-------------------------------------------------------------------------");
    let response: QueueResponse = new QueueResponse();
    let result = null;
    try {
      result = await queueTypeHandler[type](input);
    } catch (e: any) {
      //console.log("ERROR job:", type);
      response.error = e.message;
    }
    //console.log("FINISHED job:", type);
    response.result = result;
    done(null, response);
  });
}

(async () => {
  await context.addModels();
  if (!pm2id) {
    await context.syncAllModels();
  }
  consumer();
})();
