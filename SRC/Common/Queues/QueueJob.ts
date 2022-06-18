import { QueueCommandType, QueueQueryType } from "./QueueJobType";

export class QueueQueryJob {
  type!: QueueQueryType;
  priority!: number;
  input: any;
}

export class QueueCommandJob {
  type!: QueueCommandType;
  priority!: number;
  input: any;
}
