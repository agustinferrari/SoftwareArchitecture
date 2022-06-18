export enum QueueQueryType {
  ValidateElectionVotesDate = "validateElectionVotesDate",
  ValidateElectionVotesCount = "validateElectionVotesCount",
  ValidateOneVote = "checkUniqueVote",
  ValidateRepeatedVote = "checkRepeatedVote",
  GetElectionsInfo = "getElectionsInfo",
  ValidateVoterElectionCircuit = "voterElectionCircuit",
  GetVoter = "getVoter",
  GetVoteDates = "getVoteDates",
  GetVote = "getVote",
  GetVoteFrequency = "getVoteFrequency",
  GetTotalVotes = "getTotalVotes",
  GetCandidatesResult = "getCandidatesResult",
  GetPartiesResult = "getPartiesResult",
  GetElectionInfoCountPerCircuit = "getElectionInfoCountPerCircuit",
  GetElectionInfoCountPerState = "getElectionInfoCountPerState",
  GetElectionInfo = "getElectionInfo",
}

export enum QueueCommandType {
  AddVoters = "addVoters",
  AddElection = "addElection",
  AddVote = "addVote",
}
