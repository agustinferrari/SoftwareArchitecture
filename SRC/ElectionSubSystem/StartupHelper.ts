import { SequelizeContext } from "../Common/Models";
import {
  EmailNotificationSender,
  INotificationSender,
  SMSNotificationSender,
} from "../Common/NotificationSender";
import { AbstractAct, EndAct, StartAct } from "./Acts/";
import { ElectionCommand } from "./DataAccess/Command/ElectionCommand";
import { ElectionManager } from "./ElectionManager";
import { APIConsumer } from "./ElectoralConsumer/APIConsumer";
import { IConsumer } from "./ElectoralConsumer/IConsumer";
import { Parameter } from "./ElectoralConsumer/Parameter";

export class StartupHelper {
  apiConsumer?: IConsumer;
  electionManager?: ElectionManager;
  command?: ElectionCommand;
  public async startUp() {
    await this.ConfigureDBServices();
    await this.ConfigureServices();
  }

  private async ConfigureServices(): Promise<void> {
    let predefinedEmails: string[] = [];
    let electionStartSender: INotificationSender = new EmailNotificationSender(
      predefinedEmails
    );

    let predefinedPhoneNumbers: string[] = [];
    let electionEndSender: INotificationSender = new SMSNotificationSender(
      predefinedPhoneNumbers
    );

    let startAct: AbstractAct = new StartAct();
    let endAct: AbstractAct = new EndAct();

    if (this.command) {
      this.electionManager = new ElectionManager(
        this.command,
        electionStartSender,
        electionEndSender,
        startAct,
        endAct
      );
    }

    let apiParameters: Parameter[] = [];
    this.apiConsumer = new APIConsumer(apiParameters);
    console.log("Configuring services End");
  }

  private async ConfigureDBServices(): Promise<void> {
    let context: SequelizeContext = new SequelizeContext();
    // context.connection.addModels([
    //   Election,
    //   ElectionCandidate,
    //   ElectionCircuitVoter,
    //   ElectionCircuit,
    //   Circuit,
    //   Party,
    //   Voter,
    //   Candidate,
    // ]);
    await context.addModels();
    await context.syncAllModels().then(() => {
      this.command = new ElectionCommand();
    });
    let command : ElectionCommand = new ElectionCommand();
    // await command.ConnectDB();
    this.command = command;
  }
}
