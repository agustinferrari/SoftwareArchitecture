import { CommandMongo } from "./CommandMongo";

export class Command {
    static _instance: Command;
  
    constructor() {
    }
  
    static getCommand(): Command {
      if (!Command._instance) {
        Command._instance = new Command();
      }
      return Command._instance;
    }

    async AddVoteProofLog(voterCI: string, timestamp: Date, electionId:number, wasRejected:boolean) : Promise<void>{
        return await CommandMongo.AddVoteProofLog(voterCI, timestamp, electionId, wasRejected);
    }
}