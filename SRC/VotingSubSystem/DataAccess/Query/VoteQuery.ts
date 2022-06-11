import { ElectionInfo, Voter } from "../../../Common/Domain";
import { ElectionCache } from "./../../../Common/Redis/ElectionCache";
import { VoterQueryQueue } from "./VoterQueryQueue";

export class VoterQuery {
  voterQueryQueue: VoterQueryQueue;
  electionCache: ElectionCache;

  constructor(voterQuerySQL: VoterQueryQueue, electionCache: ElectionCache) {
    this.voterQueryQueue = voterQuerySQL;
    this.electionCache = electionCache;
  }

  public async getVoter(ci: string): Promise<Voter> {
    let found: Voter = await this.voterQueryQueue.getVoter(ci);
    return found;
  }

  public async voterElectionCircuit(voterCI: string, electionId: number, circuitId: number): Promise<boolean> {
    let found: boolean = await this.voterQueryQueue.voterElectionCircuit(voterCI, electionId, circuitId);
    return found;
  }

  public async checkUniqueVote(voterCI: string, electionId: number): Promise<boolean> {
    let electionInfo: ElectionInfo | null = await this.electionCache.getElection(electionId);
    if (electionInfo == null || electionInfo.mode != "unique") {
      throw new Error("Election mode is not 'unique'");
    }
    let found: boolean = await this.voterQueryQueue.checkUniqueVote(voterCI, electionId);
    return found;
  }

  public async checkRepeatedVote(voterCI: string, electionId: number): Promise<boolean> {
    let electionInfo: ElectionInfo | null = await this.electionCache.getElection(electionId);
    if (electionInfo == null || electionInfo.mode != "repeated") {
      throw new Error("Election mode is not 'repeated'");
    }
    let found: boolean = await this.voterQueryQueue.checkRepeatedVote(voterCI, electionId, electionInfo.maxVotesPerVoter);
    return found;
  }

  public async getElectionCandidates(electionId: number): Promise<string[]> {
    let electionInfo: ElectionInfo | null = await this.electionCache.getElection(electionId);
    if (electionInfo == null) {
      throw new Error("Election not found");
    }
    return electionInfo.candidateCIs;
  }
}
