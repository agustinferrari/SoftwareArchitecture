var unirest = require("unirest");
async function makeRequests(count) {
    while (currentVoter < count) {
      let voter = voters[currentVoter];
      ++currentVoter;
      let electionId = voter.electionId;
      let circuitId = voter.circuitId;
  
      let election;
      let found = false;
      for (let i = 0; i < elections.length && !found; ++i) {
        if (elections[i].id === electionId) {
          election = elections[i];
          found = true;
        }
      }
      let candidates = election.candidates;
      let pos = getRandomInt(0, candidates.length - 1);
      let candidate = candidates[pos];
      let candidateCI = candidate.ci;
  
      // let vote = {
      //   electionId,
      //   circuitId,
      //   candidateCI,
      // };
  
      // let stringifiedVote = JSON.stringify(vote);
      //  let encrypted =  voteEncryptor(stringifiedVote);
  
      let unencryptedVote = {
        voterCI: voter.ci,
        electionId,
        circuitId,
        candidateCI,
      };
  
      makeRequest(unencryptedVote);
    }
  }
  
  async function makeRequest(body) {
    unirest
      .post(url + endpoint)
      .headers({ Accept: "application/json", "Content-Type": "application/json" })
      .send(body)
      .then((response) => {
        console.log(response.body);
      });
  }
  
  var unirest = require("unirest");
  