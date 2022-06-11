import Server from "./VotingAPI/Server";
import { StartupHelper } from "./StartupHelper";
let startupHelper: StartupHelper = new StartupHelper();

startupHelper.startUp().then(() => {
  if (startupHelper.server) {
    const server : Server= startupHelper.server;
    server.start();
  }
});
