import { Query } from "./DataAccess/Query/Query";
import { QueryQueue } from "./DataAccess/Query/QueryQueue";
import { VoteEncryption } from "./VoteEncryption";
import { VotingService } from "./VotingService";
import { VoteCommandQueue } from "./DataAccess/Command/VoteCommandQueue";
import { VoteCommand } from "./DataAccess/Command/VoteCommand";
import { QueryCache } from "../Common/Redis/QueryCache";
import Server from "./VotingAPI/Server";
import { VoteIntent } from "./Models/VoteIntent";
export class StartupHelper {
  query?: Query;
  command?: VoteCommand;
  server?: Server;
  public async startUp() {
    await this.ConfigureDBServices();
    await this.ConfigureServices();
  }

  private async ConfigureServices(): Promise<void> {
    if (this.query && this.command) {
      //let encryption = new VoteEncryption(this.query);
      let votingService: VotingService = new VotingService(/*encryption,*/ this.command, this.query);
      this.server = new Server(votingService);

      let voteIntent: VoteIntent = new VoteIntent("10000202", 12045, 34182, "10068967");
      await votingService.handleVote(voteIntent);
      console.log("Termino handle vote");
    }
  }

  private async ConfigureDBServices(): Promise<void> {
    let queryCache: QueryCache = new QueryCache();

    let voterQueryQueue: QueryQueue = new QueryQueue();
    let queryQueue: Query = new Query(voterQueryQueue, queryCache);
    this.query = queryQueue;

    let voteCommandQueue: VoteCommandQueue = new VoteCommandQueue();
    this.command = new VoteCommand(voteCommandQueue);
  }
}
