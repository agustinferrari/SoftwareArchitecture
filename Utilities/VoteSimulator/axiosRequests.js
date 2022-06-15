const axios = require("axios");
const fs = require("fs");
const VoteUtils = require("./VoteUtils");
const MetricsUtils = require("./MetricsUtils");
const MongoAccess = require("../MongoUtilities/mongoAccess");


startRequests();

async function startRequests() {
  let serverConfig = JSON.parse(
    fs.readFileSync("../../SRC/VotingSubSystem/config/development.json")
  );
  let elections = await mongoAccess.getElections();

  let mongoAccess = new MongoAccess();
  let voteUtils = new VoteUtils(elections);

  let apiHost = "localhost";
  let endpoint = "/votes";
  let apiPort = serverConfig.VOTING_API.port;
  let url = "http://" + apiHost + ":" + apiPort;

  console.log("Starting vote simulator to url: " + url);
  
  let metrics = new MetricsUtils();

  metrics.totalAttempts = requestCount;

  let isFinished = false;

  let batchSize = 100000;
  let requestCount = 1;
  
  
  for (let currentBatch = 0; currentBatch < requestCount; currentBatch++) {
    let voters = await mongoAccess.getVoters(currentBatch, batchSize);

    for (let i = 0; i < batchSize && !isFinished; i++) {
      let electionVoter = voters[i];
      let startTimestamp = new Date();
      axios
        .post(url + endpoint, voteUtils.setupAxiosVote(electionVoter), {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.code >= 200 && response.code <= 299) {
            metrics.successfulAttempts++;
          }
          metrics.failedAttempts++;
          let endTimeStamp = new Date();
          let responseTime = metrics.DateDiff(endTimeStamp, startTimestamp);
          metrics.responseTimes.push(responseTime);
        })
        .catch((e) => {
          metrics.failedAttempts++;
          let endTimeStamp = new Date();
          let responseTime = metrics.DateDiff(endTimeStamp, startTimestamp);
          metrics.responseTimes.push(responseTime);
        });

      if (i == requestCount - 1 || i == voters.length - 1) {
        metrics.calculate();
        console.log(metrics);
      }
    }
  }
}
