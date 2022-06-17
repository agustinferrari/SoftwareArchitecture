const axios = require("axios");
const fs = require("fs");
const autocannon= require("autocannon");
const VoteUtils = require("./VoteUtils");
const MetricsUtils = require("./MetricsUtils");
const MongoAccess = require("../MongoUtilities/mongoAccess");
const ESC = "\x1b"; // ASCII escape character
const CSI = ESC + "["; // control sequence introducer

let first = true;
// startRequests();
autoCannonRequests();

async function startRequests() {
  let serverConfig = JSON.parse(
    fs.readFileSync("../../SRC/VotingSubSystem/config/development.json")
  );
  let appEvPublicKey = serverConfig.publicKey;
  let mongoAccess = new MongoAccess();
  let elections = await mongoAccess.getElections();
  let voteUtils = new VoteUtils(elections, appEvPublicKey);
  let metrics = new MetricsUtils();

  let apiHost = "localhost";
  let endpoint = "/votes";
  let apiPort = serverConfig.VOTING_API.port;
  let url = "http://" + apiHost + ":" + apiPort;

  console.log("Starting vote simulator to url: " + url);

  let isFinished = false;

  let batchSize = 20000;
  let batchCount = 10;

  metrics.totalAttempts = 0;

  for (
    let currentBatch = 0;
    currentBatch < batchCount && !isFinished;
    currentBatch++
  ) {
    let voters = await mongoAccess.getVoterInformation(currentBatch, batchSize);
    console.log("Batch: ", currentBatch, " Voters: ", voters.length);
    if (batchSize != voters.length) {
      isFinished = true;
    }
    let promises = [];
    for (let i = 0; i < voters.length && !isFinished; i++) {
      let electionVoter = voters[i];
      let body = voteUtils.setupVote(electionVoter);

      let startTimestamp = new Date();

      let options = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        timeout: 60000,
      };

      promises.push(
        axios
          .post(url + endpoint, body, options)
          .then((response) => {
            if (response.status >= 200 && response.status <= 299) {
              metrics.successfulAttempts++;
            } else {
              metrics.failedAttempts++;
            }
            metrics.incrementCode(response.status);
          })
          .catch((e) => {
            metrics.failedAttempts++;
            metrics.incrementCode(e.code);
          })
          .finally(() => {
            metrics.totalAttempts++;
            let responseTime = metrics.DateDiff(new Date(), startTimestamp);
            metrics.responseTimes.push(responseTime);
            // writeChangingLine(`Finished Writing ${i}`);
          })
      );
    }
    await Promise.allSettled(promises);
    console.log("Skipeo promises")
    metrics.calculate();
    console.log(metrics);
  }
}


async function autoCannonRequests(){
  let serverConfig = JSON.parse(
    fs.readFileSync("../../SRC/VotingSubSystem/config/development.json")
  );
  let appEvPublicKey = serverConfig.publicKey;
  let mongoAccess = new MongoAccess();
  let elections = await mongoAccess.getElections();
  let voteUtils = new VoteUtils(elections, appEvPublicKey);

  let apiHost = "localhost";
  let endpoint = "/votes";
  let apiPort = serverConfig.VOTING_API.port;
  let url = "http://" + apiHost + ":" + apiPort;

  let batchSize = 200;
  console.log("Starting vote simulator to url: " + url);

  let voters = await mongoAccess.getVoterInformation(0, batchSize);
  var i = 0;
  autocannon(
    {
      url: url + endpoint,
      method: "POST",
      amount: batchSize,
      connections: batchSize,
      duration: 60000,
      setupClient: (client) => {
        let electionVoter = voters[i];
        i++;
        let body = voteUtils.setupVote(electionVoter);
        client.setHeadersAndBody(
          {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          JSON.stringify(body)
        );
      },
    },
    console.log
  );
}


function writeChangingLine(name) {
  clearLastLine();
  clearLastLine();
  process.stdout.write("\n" + name + "\r");
}

function clearLastLine() {
  process.stdout.write(CSI + "A"); // moves cursor up one line
  process.stdout.write(CSI + "K"); // clears from cursor to line end
}
