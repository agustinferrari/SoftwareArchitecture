import { Voter, ElectionInfo } from "../../../Common/Domain";
import { QueryQueue } from "./QueryQueue";
import { QueryCache } from "../../../Common/Redis/QueryCache";

export class Query {
  voterQueryQueue: QueryQueue;
  queryCache: QueryCache;

  constructor(voterQuerySQL: QueryQueue, queryCache: QueryCache) {
    this.voterQueryQueue = voterQuerySQL;
    this.queryCache = queryCache;
  }

  public async getVoter(ci: string): Promise<Voter> {
    let found: Voter = await this.voterQueryQueue.getVoter(ci);
    return found;
  }

  public async getElection(electionId: number): Promise<ElectionInfo> {
    let result: ElectionInfo | null = await this.queryCache.getElection(electionId);
    console.log("Busco " + electionId + " en cache");
    if (!result) {
      throw new Error("Election not found");
    }
    return result;
  }

  public async voterElectionCircuit(
    voterCI: string,
    electionId: number,
    circuitId: number
  ): Promise<boolean> {
    let found: boolean = await this.voterQueryQueue.voterElectionCircuit(
      voterCI,
      electionId,
      circuitId
    );
    return found;
  }

  public async checkUniqueVote(voterCI: string, electionId: number): Promise<boolean> {
    let electionInfo: ElectionInfo | null = await this.queryCache.getElection(electionId);
    if (electionInfo == null) {
      throw new Error("Election not found");
    }
    if (electionInfo.mode != "unique") {
      //throw new Error("Election mode is not 'unique'");
      return false;
    }
    let found: boolean = await this.voterQueryQueue.checkUniqueVote(voterCI, electionId);
    return found;
  }

  public async checkRepeatedVote(voterCI: string, electionId: number): Promise<boolean> {
    let electionInfo: ElectionInfo | null = await this.queryCache.getElection(electionId);
    if (electionInfo == null || electionInfo.mode != "repeated") {
      //throw new Error("Election mode is not 'repeated'");
      return true;
    }
    let found = await this.voterQueryQueue.checkRepeatedVote(
      voterCI,
      electionId,
      electionInfo.maxVotesPerVoter
    );
    return found;
  }

  public async getElectionCandidates(electionId: number): Promise<string[]> {
    let electionInfo: ElectionInfo | null = await this.queryCache.getElection(electionId);
    if (electionInfo == null) {
      throw new Error("Election not found");
    }
    return electionInfo.candidateCIs;
  }

  public async validateVoteTime(timestamp: Date, electionId: number): Promise<boolean> {
    let electionInfo: ElectionInfo | null = await this.queryCache.getElection(electionId);
    if (electionInfo == null) {
      return false;
    }
    return (
      this.parseDate(electionInfo.startDate) <= timestamp &&
      timestamp <= this.parseDate(electionInfo.endDate)
    );
  }

  private parseDate(myDateStr: string): Date {
    const dateStr = myDateStr;
    const [dateComponents, timeComponents] = dateStr.split(" ");

    const [year, month, day] = dateComponents.split("-");
    const [hours, minutes, seconds] = timeComponents.split(":");

    const date = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
    return date;
  }
}
