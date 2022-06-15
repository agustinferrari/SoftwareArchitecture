const axios = require("axios");
const fs = require("fs");
const VoteUtils = require("./VoteUtils");
const MetricsUtils = require("./MetricsUtils");
let serverConfig = JSON.parse(
  fs.readFileSync("../../SRC/VotingSubSystem/config/development.json")
);

let voteUtils = new VoteUtils();
let apiHost = "localhost";
let endpoint = "/votes";
let apiPort = serverConfig.VOTING_API.port;
let url = "http://" + apiHost + ":" + apiPort;


let voters = JSON.parse(
  fs.readFileSync("./VoterVotingInformation.json")
).voters;

console.log("Starting vote simulator to url: " + url);

let metrics = new MetricsUtils();

let requestStart = 0;
let requestCount = 1;

metrics.totalAttempts=requestCount;


for(let i =requestStart ; i<voters.length && i< requestCount ; i++){
    let electionVoter = voters[i];
    let startTimestamp = new Date();
    axios
    .post(url + endpoint, voteUtils.setupAxiosVote(electionVoter), {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
    .then((response)=>{
        if(response.code>=200 && response.code<=299){
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

    if(i == requestCount-1 || i == voters.length -1){
        metrics.calculate();
        console.log(metrics);
    }
}



