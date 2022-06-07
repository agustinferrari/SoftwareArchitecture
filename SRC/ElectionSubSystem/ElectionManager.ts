import { ElectionDTO, VoterDTO } from "../Common/Domain";
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
    let currentPage: number = 1;
    let continueSearching: boolean = false;

    do {
      continueSearching = await this.addVoters(election.id, currentPage);
      currentPage++;
      var memory: number = process.memoryUsage().heapTotal;
      while (memory > 996286464) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        console.log(
          "Waiting for my friend the Garbage Collector " +
            this.formatBytes(memory)
        );
        memory = process.memoryUsage().heapTotal;
      }
    } while (continueSearching);

    scheduler.scheduleStartElection(election);
    scheduler.scheduleEndElection(election);
  }

  private async validateElection(election: ElectionDTO): Promise<void> {
    this.validatorManager.createPipeline(election, "startElection");
    this.validatorManager.validate();
  }

  private async addVoters(
    idElection: number,
    pageNumber: number
  ): Promise<boolean> {
    await this.commander.addVoters(
      await this.electoralConsumer.getVoterPaginated(
        idElection,
        pageNumber,
        config.get("API.votersPageLimit")
      ),
      idElection
    );
    return true;
  }

  private formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
}
