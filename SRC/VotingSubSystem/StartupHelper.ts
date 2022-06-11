import { VoterQuery } from "./DataAccess/Query/VoteQuery";
import { VoterQueryQueue } from "./DataAccess/Query/VoterQueryQueue";
import { VoteEncryption } from "./VoteEncryption";
import Server from "./VotingAPI/Server";
export class StartupHelper {
  query?: VoterQuery;
  server?: Server;
  public async startUp() {
    await this.ConfigureDBServices();
    await this.ConfigureServices();
  }

  private async ConfigureServices(): Promise<void> {

    if (this.query) {
        let encryption = new VoteEncryption(this.query);
        this.server = new Server(encryption);
    }
  }

  private async ConfigureDBServices(): Promise<void> {
    let voterQueryQueue: VoterQueryQueue = new VoterQueryQueue();
    let queryQueue: VoterQuery = new VoterQuery(voterQueryQueue);
    this.query = queryQueue;
  }
}
