import { scheduleJob } from "node-schedule";
import { ElectionManager } from "../ElectionManager";
import { Election } from "../../Common/Domain";

export class ElectionScheduler {
  manager: ElectionManager;

  constructor(manager: ElectionManager) {
    this.manager = manager;
  }

  public async scheduleStartElection(election: Election, voterCount : number): Promise<void> {
    console.log("scheduled start election " + election.id);
    scheduleJob(this.parseDate(election.startDate), () => {
      this.manager.startElection(election, voterCount);
    });
  }

  public async scheduleEndElection(election: Election, voterCount : number): Promise<void> {
    console.log("scheduled end election " + election.id);
    scheduleJob(this.parseDate(election.endDate), () => {
      this.manager.endElection(election, voterCount);
    });
  }

  private parseDate(myDateStr: string): Date {
    if(myDateStr.includes("T") && myDateStr.charAt(myDateStr.length-1)){
      return new Date(myDateStr);
    }
    const dateStr = myDateStr;
    const [dateComponents, timeComponents] = dateStr.split(" ");

    const [year, month, day] = dateComponents.split("-");
    const [hours, minutes, seconds] = timeComponents.split(":");

    const date = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
    return date;
  }
}
