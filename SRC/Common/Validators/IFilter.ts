export class IFilter {
  error: string;
  maxAttempts: number;
  async validate(): Promise<void>{};
  constructor(){
    this.error = "";
    this.maxAttempts = 1;
  }
}
