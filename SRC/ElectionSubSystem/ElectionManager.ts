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
    elections.forEach(async (election) => {
      let existsInCache = await this.query.existsElection(election.id);
      if (!existsInCache) {
        console.log(
          "Election: " + election.id + "| VoterCount: " + election.voterCount
        );
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
      await this.validateElection(election);
      console.log(
        "Election validated: " +
          election.id +
          "| VoterCount: " +
          election.voterCount
      );
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
    console.log("termino manager election");
    this.addVoters(election.id, 1);
    scheduler.scheduleStartElection(election);
    scheduler.scheduleEndElection(election);
  }

  private async validateElection(election: ElectionDTO): Promise<void> {
    this.validatorManager.createPipeline(election, "startElection");
    this.validatorManager.validate();
  }

  private async addVoters(idElection: number, pageNumber: number): Promise<void> {
    this.electoralConsumer
      .getVoterPaginated(
        idElection,
        pageNumber,
        config.get("API.votersPageLimit")
      )
      .then(async (voters) => {
        if (voters.length > 0) {
          this.commander.addVoters(voters, idElection);
          this.addVoters(idElection, ++pageNumber);
        }
      });
  }
}
