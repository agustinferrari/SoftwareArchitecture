import Queue from "bull";
import config from "config";

const queue = new Queue<number>("testQueue", {
  redis: { port: config.get("REDIS.port"), host: config.get("REDIS.host") },
});

async function consumer() {
  console.log("Consumer started");
  queue.process(function (job, done) {
    console.log("Received job:", job.data);
    done(null, { result: "TestStringDiferente", multiplication: job.data * 2 });
  });
}



async function producer() {
  console.log("Producer started");
  let job = await queue.add(14);
  let result = await job.finished();
  console.log("result:", result.multiplication);
}

(async () => {
    // consumer();
  producer();
})();
