import { QueueJobType } from "./QueueJobType";

export class QueueJob {
  type!: QueueJobType;
  priority!: number;
  input: any;
}
