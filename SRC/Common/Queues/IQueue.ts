import { VoteInfo } from "../Domain/VoteInfo";

export interface IQueue<T>{
    getFromQueue(): Promise<T>
    addToQueue(voteInfo: VoteInfo): Promise<void>
    isInQueue(voteInfo: VoteInfo): Promise<boolean>
}