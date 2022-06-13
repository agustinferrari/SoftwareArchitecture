export class VoteUtils {

  static getElection(electionId) {
    for (let i = 0; i < elections.length; ++i) {
      if (elections[i].id === electionId) {
        return elections[i];
      }
    }

    console.log("NO ELECTION BY ID " + electionId);
  }

  static getRandomCandidate(election) {
    let candidates = election.candidates;
    let pos = VoteManager.getRandomInt(0, candidates.length - 1);
    return candidates[pos];
  }

  static checkIfAlreadyVoted() {
    let currentVoterElection = { voterCI: voter.ci, electionId: electionId };
    let alreadyVoted = false;

    for (let i = 0; i < previousVoterElection.length && !alreadyVoted; ++i) {
      let previousCI = previousVoterElection[i].voterCI;
      let previousElection = previousVoterElection[i].electionId;

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
    previousVoterElection.push(currentVoterElection);
  }

  static getRandomDate(from, to) {
    const fromTime = from.getTime();
    const toTime = to.getTime();
    return new Date(fromTime + Math.random() * (toTime - fromTime));
  }

  static formatDate(date) {
    date += "Z";
    let result = date.replace(" ", "T");
    return new Date(result);
  }

  static getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
