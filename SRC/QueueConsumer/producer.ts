import Queue from "bull";
import config from "config";
import { Election } from "../Common/Domain";
import { QueueJob, QueueJobPriority, QueueJobType, QueueResponse } from "../Common/Queues";

const queue = new Queue<QueueJob>("sqlqueue", {
  redis: { port: config.get("REDIS.port"), host: config.get("REDIS.host") },
});

let electionsJson = `{
  "id": 87884,
  "name": "Election Applications",
  "description": "Suscipit provident doloribus velit fuga quia.",
  "startDate": "2022-12-13 12:57:22",
  "endDate": "2023-07-22 5:52:36",
  "mode": "repeated",
  "circuits": [
    { "id": 79007, "state": "Caguas", "location": "Greeley" },
    { "id": 60791, "state": "Longview", "location": "Syracuse" }
  ],
  "parties": [{ "id": 70276, "name": "maroon" }],
  "candidates": [
    {
      "ci": "74862165",
      "name": "Jason",
      "lastName": "Barton",
      "gender": "Female",
      "birthday": "1922-06-13",
      "partyId": 70276
    }
  ]
}`;

async function producer() {
  console.log("Producer started");

  let election: Election = new Election(JSON.parse(electionsJson));
  let queueJob = new QueueJob();
  queueJob.input = election;
  queueJob.priority = QueueJobPriority.AddElection;
  queueJob.type = QueueJobType.AddElection;
  let job = await queue.add(queueJob);
  let result: QueueResponse = await job.finished();
  console.log("result:", result.result, " error:", result.error);
}

async function validateUserElectionParty() {
  console.log("Producer started");

  let queueJob = new QueueJob();
  queueJob.input = { voterCI: "10000246", electionId: 19014, circuitId: 14276 };
  queueJob.priority = QueueJobPriority.ValidateVoterElectionCircuit;
  queueJob.type = QueueJobType.ValidateVoterElectionCircuit;
  let job = await queue.add(queueJob);
  let result: QueueResponse = await job.finished();
  console.log("result:", result.result, " error:", result.error);
}

(async () => {
  validateUserElectionParty();
})();
