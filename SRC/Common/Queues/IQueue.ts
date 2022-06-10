import { Vote } from "../Domain/Vote";

export interface IQueue<T> {
  getFromQueue(): Promise<T>;
  addToQueue(voteInfo: Vote): Promise<void>;
  isInQueue(voteInfo: Vote): Promise<boolean>;
}
