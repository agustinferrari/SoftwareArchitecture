import { ElectionDTO } from "../Common/Domain";
import { ElectionScheduler } from "./EventSchedulers/ElectionScheduler";
import { ElectionCommand } from "./DataAccess/Command/ElectionCommand";
import { INotificationSender } from "../Common/NotificationSender/INotificationSender";
import { AbstractAct } from "./Acts/AbstractAct";
import { AbstractValidatorManager } from "../Common/Validators/AbstractValidatorManager";
import { IConsumer } from "./ElectoralConsumer/IConsumer";
import config from "config";
import { ElectionQuery } from "./DataAccess/Query/ElectionQuery";

export class ElectionManager {
  electionStartSender: INotificationSender;
  electionEndSender: INotificationSender;
  startAct: AbstractAct;
  endAct: AbstractAct;
  commander: ElectionCommand;
  query: ElectionQuery;
  validatorManager: AbstractValidatorManager<ElectionDTO>;
  electoralConsumer: IConsumer;

  public constructor(
    electionCommand: ElectionCommand,
    electionQuery: ElectionQuery,
    electionStartSender: INotificationSender,
    electionEndSender: INotificationSender,
    startAct: AbstractAct,
    endAct: AbstractAct,
    validatorManager: AbstractValidatorManager<ElectionDTO>,
    electoralConsumer: IConsumer
  ) {
    this.commander = electionCommand;
    this.query = electionQuery;
    this.electionStartSender = electionStartSender;
    this.electionEndSender = electionEndSender;
    this.startAct = startAct;
    this.endAct = endAct;
    this.validatorManager = validatorManager;
    this.electoralConsumer = electoralConsumer;
  }

  public async handleElections(elections: ElectionDTO[]): Promise<void> {
    elections.forEach((election) => {
      if (!this.query.existsElection(election.id)) {
        this.handleElection(election);
      }
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
    try {
      this.validateElection(election);
    } catch (e: any) {
      //TODO: Enviar mail a asignados
      //TODO: Enviar log de error
      console.log(
        "Election is not valid, election id: " +
          election.id +
          " error: " +
          e.message
      );
      return;
    }
    const scheduler = new ElectionScheduler(this);
    console.log("[Valid Election: " + election.id + "]");

    await this.commander.addElection(election);
    this.addVoters(election.id, 1);
    scheduler.scheduleStartElection(election);
    scheduler.scheduleEndElection(election);
  }

  private validateElection(election: ElectionDTO): void {
    this.validatorManager.createPipeline(election, "startElection");
    this.validatorManager.validate();
  }

  private async addVoters(idElection: number, pageNumber: number) {
    this.electoralConsumer
      .getVoterPaginated(idElection, pageNumber, config.get("votersPageLimit"))
      .then((voters) => {
        if (voters.length > 0) {
          console.log("page " + pageNumber + "added");
          pageNumber++;
          this.commander.addVoters(voters, idElection);
          this.addVoters(idElection, pageNumber);
        }
      });
  }
}
