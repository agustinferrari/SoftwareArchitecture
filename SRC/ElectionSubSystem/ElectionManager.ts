import { ElectionDTO } from "../Common/Domain";
import { ElectionScheduler } from "./EventSchedulers/ElectionScheduler";
import { ElectionCommand } from "./DataAccess/Command/ElectionCommand";
import { INotificationSender } from "../Common/NotificationSender/INotificationSender";
import { AbstractAct } from "./Acts/AbstractAct";
import { AbstractValidatorManager } from "../Common/Validators/AbstractValidatorManager";

export class ElectionManager {
  electionStartSender: INotificationSender;
  electionEndSender: INotificationSender;
  startAct: AbstractAct;
  endAct: AbstractAct;
  commander: ElectionCommand;
  validatorManager: AbstractValidatorManager<ElectionDTO>;

  public constructor(
    electionCommand: ElectionCommand,
    electionStartSender: INotificationSender,
    electionEndSender: INotificationSender,
    startAct: AbstractAct,
    endAct: AbstractAct,
    validatorManager: AbstractValidatorManager<ElectionDTO>
  ) {
    this.commander = electionCommand;
    this.electionStartSender = electionStartSender;
    this.electionEndSender = electionEndSender;
    this.startAct = startAct;
    this.endAct = endAct;
    this.validatorManager = validatorManager;
  }

  public async handleElections(elections: ElectionDTO[]): Promise<void> {
    elections.forEach((election) => {
      this.handleElection(election);
    });
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
    if (this.validateElection(election)) {
      const scheduler = new ElectionScheduler(this);
      console.log("[Valid Election: " + election.id + "]");

      await this.commander.addElectionSeq(election);
      scheduler.scheduleStartElection(election);
      scheduler.scheduleEndElection(election);
    } else {
      //TODO: Enviar mail a asignados
      //TODO: Enviar log de error
      console.log("Election is not valid, election id: " + election.id);
    }
  }

  private validateElection(election: ElectionDTO): boolean {
    this.validatorManager.createPipeline(election, "startElection");
    return this.validatorManager.validate();
  }
}
