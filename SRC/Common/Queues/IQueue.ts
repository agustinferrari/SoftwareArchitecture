import { VoteInfo } from "../Domain/VoteInfo";

export interface IQueue{
    getFromQueue(): Promise<VoteInfo>
    addToQueue(voteInfo: VoteInfo): Promise<void>
    isInQueue(voteInfo: VoteInfo): Promise<boolean>
}