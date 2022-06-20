import {} from "../Common/Domain";
import { SequelizeContext } from "./Models";
import Queue from "bull";
import config from "config";
import { QueueCommandJob, QueueQueryJob, QueueResponse } from "../Common/Queues";
import { QuerySQL } from "./DataAccess/Query/QuerySQL";
import { QueueTypeHandler } from "./QueueTypeHandler";
import { CommandSQL } from "./DataAccess/Command/CommandSQL";


let MySQLPort : string = config.get("SQL_DB.masterPort");

let context: SequelizeContext = new SequelizeContext(MySQLPort);
const query = new QuerySQL(context.connection);
const command = new CommandSQL(context.connection);
const queueTypeHandler = new QueueTypeHandler(query, command);

//Consumidor

const queue = new Queue<QueueCommandJob>(config.get("REDIS.commandQueue"), {
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
  let pm2id = process.env.pm_id;
  if (pm2id) {
    let id = parseInt(pm2id);
    if(id == 0){
      console.log("Syncing models for port:", MySQLPort);
      await context.syncAllModels();
      await context.setMaxConnections();
    }
  }else{
    await context.syncAllModels();
    await context.setMaxConnections();
  }
  consumer();
})();
