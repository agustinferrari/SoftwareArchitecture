const axios = require("axios");
const fs = require("fs");
const VoteUtils = require("./VoteUtils");
const MetricsUtils = require("./MetricsUtils");
const MongoAccess = require("../MongoUtilities/mongoAccess");
const ESC = "\x1b"; // ASCII escape character
const CSI = ESC + "["; // control sequence introducer

const OnlyOneRequest = true;

startRequests();

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

  let batchSize = 100000;
  let batchCount = 10;

  metrics.totalAttempts = 0;

  for (
    let currentBatch = 0;
    currentBatch < batchCount && !isFinished;
    currentBatch++
  ) {
    let voters = await mongoAccess.getVoterInformation(currentBatch, batchSize);
    if (batchSize != voters.length) {
      isFinished = true;
    }
    for (let i = 0; i < voters.length; i++) {
      let electionVoter = voters[i];
      let body = voteUtils.setupVote(electionVoter);
      let startTimestamp = new Date();
      axios
        .post(url + endpoint, body, {
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
        })
        .finally(() => {
          metrics.totalAttempts++;
        });
      metrics.calculate();
      writeChangingLine(JSON.stringify(metrics));
      // if (i == batchCount - 1 || i == voters.length - 1) {
      //   metrics.calculate();
      //   console.log(metrics);
      // }
    }
  }
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
