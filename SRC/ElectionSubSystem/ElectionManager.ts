import { ElectionDTO } from "../Common/Domain";
import { ElectionScheduler } from "./EventSchedulers/ElectionScheduler";
import { ElectionCommand } from "./DataAccess/Command/ElectionCommand";
import { INotificationSender } from "../Common/NotificationSender/INotificationSender";
import { AbstractAct } from "./Acts/AbstractAct";

export class ElectionManager {
  electionStartSender: INotificationSender;
  electionEndSender: INotificationSender;
  startAct: AbstractAct;
  endAct: AbstractAct;
  commander: ElectionCommand;

  public constructor(
    electionCommand: ElectionCommand,
    electionStartSender: INotificationSender,
    electionEndSender: INotificationSender,
    startAct: AbstractAct,
    endAct: AbstractAct
  ) {
    this.commander = electionCommand;
    this.electionStartSender = electionStartSender;
    this.electionEndSender = electionEndSender;
    this.startAct = startAct;
    this.endAct = endAct;
  }

  public async handleElections(elections: ElectionDTO[]): Promise<void> {
    elections.forEach((election) => {
      this.handleElection(election);
    });
    console.log("es o no");
  }

  public startElection(election: ElectionDTO): void {
    let act: string = this.startAct.getActInformation(election);
    this.electionStartSender.sendNotification(act);
  }

  public endElection(election: ElectionDTO): void {
    let act: string = this.endAct.getActInformation(election);
    this.electionEndSender.sendNotification(act);
  }

  private async handleElection(election: ElectionDTO): Promise<void> {
    try {
      await this.validateElection(election);
    } catch (e: any) {
      console.log(e.message);
    }
    const scheduler = new ElectionScheduler(this);

    this.commander.addElection(election);
    scheduler.scheduleStartElection(election);
    scheduler.scheduleEndElection(election);
  }

  private validateElection(election: ElectionDTO): void {
    console.log(election.id + " validada");
  }
}
