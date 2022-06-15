const fs = require("fs");
class VoteUtils {
  
  constructor(elections) {
    let voters = [];
    
    for (let i = 0; i < jsonVoters.length; i++) {
      let numberToVote = 3;
      let randomNumber = this.getRandomInt(1, 3);
      if (numberToVote == randomNumber) {
        voters.push(jsonVoters[i]);
      }
    }
    
    voters = jsonVoters;
    this.elections = elections;
    this.currentVoter = 0;
    this.previousVoterElection = [];
  }

  setupVote(voter) {
    ++this.currentVoter;

    let electionId = voter.electionId;
    let circuitId = voter.circuitId;

    let election = this.getElection(electionId);
    let candidate = this.getRandomCandidate(election);
    let candidateCI = candidate.ci;


    let startDate = this.formatDate(election.startDate);
    let endDate = this.formatDate(election.endDate);

    startDate.setDate(startDate.getDate() + 1);
    endDate.setDate(endDate.getDate() - 1);
    let randomDate = this.getRandomDate(startDate, endDate);

    let startTimestamp = randomDate.toISOString();
    let unencryptedVote = {
      voterCI: voter.ci,
      electionId,
      circuitId,
      candidateCI,
      startTimestamp,
    };

    this.checkIfAlreadyVoted(voter, electionId);
    return unencryptedVote;
  }

  setupAxiosVote(voter) {
    let electionId = voter.electionId;
    let circuitId = voter.circuitId;

    let election = this.getElection(electionId);
    let candidate = this.getRandomCandidate(election);
    let candidateCI = candidate.ci;


    let startDate = this.formatDate(election.startDate);
    let endDate = this.formatDate(election.endDate);

    startDate.setDate(startDate.getDate() + 1);
    endDate.setDate(endDate.getDate() - 1);

    let randomDate = this.getRandomDate(startDate, endDate);

    let startTimestamp = randomDate.toISOString();
    let unencryptedVote = {
      voterCI: voter.ci,
      electionId,
      circuitId,
      candidateCI,
      startTimestamp,
    };

    this.checkIfAlreadyVoted(voter, electionId);
    return unencryptedVote;
  }

  getElection(electionId) {
    for (let i = 0; i < this.elections.length; ++i) {
      if (this.elections[i].id === electionId) {
        return this.elections[i];
      }
    }

    console.log("NO ELECTION BY ID " + electionId);
  }

  getRandomCandidate(election) {
    let candidates = election.candidates;
    let pos = this.getRandomInt(0, candidates.length - 1);
    return candidates[pos];
  }

  checkIfAlreadyVoted(voter, electionId) {
    let currentVoterElection = { voterCI: voter.ci, electionId: electionId };
    let alreadyVoted = false;

    for (let i = 0; i < this.previousVoterElection.length && !alreadyVoted; ++i) {
      let previousCI = this.previousVoterElection[i].voterCI;
      let previousElection = this.previousVoterElection[i].electionId;

      if (
        previousCI == currentVoterElection.voterCI &&
        previousElection == currentVoterElection.electionId
      ) {
        alreadyVoted = true;
      }
    }

    if (alreadyVoted) {
      console.log("Already Voted: ", currentVoterElection);
    }
    this.previousVoterElection.push(currentVoterElection);
  }

  getRandomDate(from, to) {
    const fromTime = from.getTime();
    const toTime = to.getTime();
    return new Date(fromTime + Math.random() * (toTime - fromTime));
  }

  formatDate(date) {
    date += "Z";
    let result = date.replace(" ", "T");
    return new Date(result);
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

module.exports = VoteUtils;