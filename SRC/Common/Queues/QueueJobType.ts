export enum QueueJobType {
  AddVoters = "addVoters",
  AddElection = "addElection",
  GetElectionsInfo = "getElectionsInfo",
  ValidateVoterElectionCircuit = "voterElectionCircuit",
  ValidateOneVote = "checkUniqueVote",
  GetVoter = "getVoter",
  ValidateRepeatedVote = "checkRepeatedVote",
}
