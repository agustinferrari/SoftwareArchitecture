<<<<<<< HEAD
export enum QueueJobPriority {
  AddVoters = 1,
  GetVote = 1,
  AddElection = 2,
  ValidateElectionVotesDate = 2,
  ValidateElectionVotesCount = 3,
  AddVote = 3,
  GetElectionsInfo = 4,
  ValidateOneVote = 5,
  ValidateRepeatedVote = 5,
  ValidateVoterElectionCircuit = 5,
  GetElectionInfoCountPerCircuit = 5,
  GetElectionInfoCountPerState = 5,
  GetVoter = 6,
  GetVoteDates = 6,
  GetVoteFrequency = 6,
  GetTotalVotes = 4,
  GetPartiesResult = 6,
  GetCandidatesResult = 6,
  GetElectionInfo = 10,
  GetElectionCandidates = 10,
  GetElectionParties = 10
=======
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
>>>>>>> develop
}
