import { Election, Voter } from "../Common/Domain";
import { ElectionScheduler } from "./EventSchedulers/ElectionScheduler";
import { ElectionCommand } from "./DataAccess/Command/ElectionCommand";
import { INotificationSender } from "../Common/NotificationSender/INotificationSender";
import { AbstractAct } from "./Acts/AbstractAct";
import { AbstractValidatorManager } from "../Common/Validators/AbstractValidatorManager";
import { IConsumer } from "./ElectoralConsumer/IConsumer";
import config from "config";
import { ElectionQuery } from "./DataAccess/Query/ElectionQuery";

export class ElectionManager {
  emailSender: INotificationSender;
  startAct: AbstractAct;
  endAct: AbstractAct;
  command: ElectionCommand;
  query: ElectionQuery;
  validatorManager: AbstractValidatorManager<Election>;
  electoralConsumer: IConsumer;

  public constructor(
    electionCommand: ElectionCommand,
    electionQuery: ElectionQuery,
    emailSender: INotificationSender,
    startAct: AbstractAct,
    endAct: AbstractAct,
    validatorManager: AbstractValidatorManager<Election>,
    electoralConsumer: IConsumer
  ) {
    this.command = electionCommand;
    this.query = electionQuery;
    this.emailSender = emailSender;
    this.startAct = startAct;
    this.endAct = endAct;
    this.validatorManager = validatorManager;
    this.electoralConsumer = electoralConsumer;
  }

  public async handleElections(elections: Election[]): Promise<void> {
    for (let i: number = 0; i < elections.length; i++) {
      let election: Election = elections[i];
      let existsInCache = await this.query.existsElection(election.id);
      console.log("Election id: " + election.id + " exists in cache: " + existsInCache);
      if (!existsInCache) {
        await this.handleElection(election);
      }
    }
  }

  public async startElection(election: Election, voterCount: number): Promise<void> {
    this.startAct.generateAndSendAct(
      election,
      voterCount,
      await this.query.getElectionEmails(election.id),
      this.emailSender
    );
  }

  public async endElection(election: Election, voterCount: number): Promise<void> {
    //TODO validar
    await this.validatorManager.createPipeline(election, "endElection");
    try {
      await this.validatorManager.validate();
    } catch (e: any) {
      let message = "ERROR ON ELECTION END:" + e.message;
      this.emailSender.sendNotification(message, election.emails);
    }
    this.endAct.generateAndSendAct(
      election,
      voterCount,
      await this.query.getElectionEmails(election.id),
      this.emailSender
    );
  }

  private async handleElection(election: Election): Promise<void> {
    try {
      await this.validateElection(election);
      console.log("Election validated: " + election.id);
    } catch (e: any) {
      //TODO: Enviar mail a asignados
      //TODO: Enviar log de error
      let message = "Election is not valid, election id: " + election.id + " error: \n" + e.message;
      this.emailSender.sendNotification(message, election.emails);

      // console.log("Election is not valid, election id: " + election.id + " error: \n" + e.message);
      return;
    }
    const scheduler = new ElectionScheduler(this);

    await this.command.addElection(election);
    let currentPage: number = 1;
    let totalAdded: number = 0;
    let lastAdded: number = 0;
    do {
      lastAdded = await this.addVoters(election.id, currentPage);
      totalAdded += lastAdded;
      currentPage++;
      var memory: number = process.memoryUsage().heapTotal;

      while (memory > 996286464) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        console.log("Waiting for my friend the Garbage Collector " + this.formatBytes(memory));
        memory = process.memoryUsage().heapTotal;
      }
    } while (lastAdded > 0);

    this.command.addVoterCount(election.id, totalAdded);
    scheduler.scheduleStartElection(election, totalAdded);
    scheduler.scheduleEndElection(election, totalAdded);
    return;
  }

  private async validateElection(election: Election): Promise<void> {
    await this.validatorManager.createPipeline(election, "startElection");
    await this.validatorManager.validate();
  }

  private async addVoters(idElection: number, pageNumber: number): Promise<number> {
    return await this.command.addVoters(
      await this.electoralConsumer.getVoterPaginated(
        idElection,
        pageNumber,
        config.get("API.votersPageLimit")
      ),
      idElection
    );
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
