import { QueueJobType } from "./QueueJobTypes";

export class QueueJob {
  type!: QueueJobType;
  timestamp!: Date;
  priority!: number;
}
