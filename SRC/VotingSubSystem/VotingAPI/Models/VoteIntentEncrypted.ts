export class VoteIntentEncrypted {
  voterCI: string;
  data: string;
  constructor(
    ci: string,
    data: string
  ) {
    this.voterCI = ci;
    this.data = data;
  }
}
