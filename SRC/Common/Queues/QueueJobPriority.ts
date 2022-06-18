export enum QueueQueryPriority {
  GetVote = 10,
  ValidateElectionVotesDate = 9,
  ValidateElectionVotesCount = 8,
  GetElectionsInfo = 7,
  GetTotalVotes = 7,
  ValidateOneVote = 6,
  ValidateRepeatedVote = 6,
  ValidateVoterElectionCircuit = 6,
  GetElectionInfoCountPerCircuit = 6,
  GetElectionInfoCountPerState = 6,
  GetVoter = 5,
  GetVoteDates = 5,
  GetVoteFrequency = 5,
  GetPartiesResult = 5,
  GetCandidatesResult = 5,
  GetElectionInfo = 1,
}

export enum QueueCommandPriority {
  DeleteVoterCandidateAssociation= 10,
  AddVoters = 10,
  AddElection = 9,
  AddVote = 8,
}
