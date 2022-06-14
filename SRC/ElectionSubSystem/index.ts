import { APIScheduler } from "./EventSchedulers/APIScheduler";
import { StartupHelper } from "./StartupHelper";

let startup: StartupHelper = new StartupHelper();

startup.startUp().then(() => {
  if (startup.apiConsumer && startup.electionManager) {
    const scheduler = new APIScheduler(startup.apiConsumer, startup.electionManager);
    scheduler.startRecurrentGet();
  }
});
