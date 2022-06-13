export enum QueueJobPriority {
  AddVoters = 1,
  AddElection = 2,
  AddVote = 3,
  GetElectionsInfo = 4,
  ValidateOneVote = 5,
  ValidateRepeatedVote = 5,
  ValidateVoterElectionCircuit = 5,
  GetElectionInfoCountPerCircuit = 5,
  GetVoter = 6,
  GetVoteDates = 6,
  GetVoteFrequency = 6,
}
