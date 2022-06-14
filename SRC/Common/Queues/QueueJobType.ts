export enum QueueJobType {
  AddVoters = "addVoters",
  AddElection = "addElection",
  ValidateOneVote = "checkUniqueVote",
  ValidateRepeatedVote = "checkRepeatedVote",
  AddVote = "addVote",
  GetElectionsInfo = "getElectionsInfo",
  ValidateVoterElectionCircuit = "voterElectionCircuit",
  GetVoter = "getVoter",
  GetVoteDates = "getVoteDates",
  GetVoteFrequency = "getVoteFrequency",
  GetElectionInfoCountPerCircuit = "getElectionInfoCountPerCircuit",
  GetElectionInfoCountPerState = "getElectionInfoCountPerState",
}
