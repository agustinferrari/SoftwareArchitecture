const axios = require("axios");
const fs = require("fs");
const autocannon = require("autocannon");
const VoteUtils = require("./VoteUtils");
const MongoAccess = require("../MongoUtilities/mongoAccess");
const config = require("config");
const voteOptions = config.get("VoteOptions");
// startRequests();
autoCannonRequests();

async function autoCannonRequests() {
  let serverConfig = JSON.parse(
    fs.readFileSync("../../SRC/VotingSubSystem/config/development.json")
  );
  let appEvPublicKey = serverConfig.publicKey;
  let mongoAccess = new MongoAccess();
  let elections = await mongoAccess.getElections();
  let voteUtils = new VoteUtils(elections, appEvPublicKey);

  let apiHost = voteOptions.apiHost;
  let endpoint = "/votes";
  let apiPort = serverConfig.VOTING_API.port;
  let url = "http://" + apiHost + ":" + apiPort;

  let offset = voteOptions.pageOffset;
  let batchSize = voteOptions.batchSize;
  let timeout = voteOptions.timeout;
  console.log(
    "Starting vote simulator to url: " + url + endpoint + " with options:"
  );
  console.log(voteOptions);
  console.log("----------------------");
  console.log("");

  let voters = await mongoAccess.getVoterInformation(offset, batchSize);
  var i = 0;

  if (voteOptions.saveOneToJson) {
    let electionVoter = voters[i];
    if (electionVoter == undefined) {
      console.log(i);
    }
    let body = voteUtils.setupVote(electionVoter, voteOptions.fakeVoteDate);
    console.log(body);
    fs.writeFileSync("./testVote.json", JSON.stringify(body));
  } else {
    autocannon(
      {
        url: url + endpoint,
        method: "POST",
        amount: batchSize,
        connections: batchSize,
        duration: timeout,
        setupClient: (client) => {
          let electionVoter = voters[i];
          if (electionVoter == undefined) {
            console.log(i);
          }
          i++;
          let body = voteUtils.setupVote(
            electionVoter,
            voteOptions.fakeVoteDate
          );
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
}
