import Server from "./VotingAPI/Controllers/Server";
import { StartupHelper } from "./Helpers/StartupHelper";
let startupHelper: StartupHelper = new StartupHelper();

startupHelper.startUp().then(() => {
  if (startupHelper.server) {
    const server: Server = startupHelper.server;
    server.start();
  }
});
