import {
  EmailNotificationSender,
  INotificationSender,
  SMSNotificationSender,
} from "../Common/NotificationSender";
import { Election } from "../Common/Domain";
import { AbstractValidatorManager } from "../Common/Validators/AbstractValidatorManager";
import { AbstractAct, EndAct, StartAct } from "./Acts/";
import { ElectionCommand } from "./DataAccess/Command/ElectionCommand";
import { ElectionQuery } from "./DataAccess/Query/ElectionQuery";
import { ElectionManager } from "./ElectionManager";
import { APIConsumer } from "./ElectoralConsumer/APIConsumer";
import { IConsumer } from "./ElectoralConsumer/IConsumer";
import { Parameter } from "./ElectoralConsumer/Parameter";
import { ValidatorManager } from "./Validators/ValidatorManager";
import { CommandCache } from "../Common/Redis/CommandCache";
import { QueryCache } from "../Common/Redis/QueryCache";
import { RedisContext } from "../Common/Redis/RedisContext";
import { ElectionQueryQueue } from "./DataAccess/Query/ElectionQueryQueue";
import { ElectionCommandQueue } from "./DataAccess/Command/ElectionCommandQueue";

export class StartupHelper {
  apiConsumer?: IConsumer;
  electionManager?: ElectionManager;
  command?: ElectionCommand;
  query?: ElectionQuery;

  public async startUp() {
    await this.ConfigureDBServices();
    await this.ConfigureServices();
  }

  private async ConfigureServices(): Promise<void> {
    let emailSender: INotificationSender = new EmailNotificationSender();

    let startAct: AbstractAct = new StartAct();
    let endAct: AbstractAct = new EndAct();

    let validatorManager: AbstractValidatorManager<Election> = new ValidatorManager();

    let apiParameters: Parameter[] = [];
    this.apiConsumer = new APIConsumer(apiParameters);

    if (this.command && this.query) {
      this.electionManager = new ElectionManager(
        this.command,
        this.query,
        emailSender,
        startAct,
        endAct,
        validatorManager,
        this.apiConsumer
      );
    }
  }

  private async ConfigureDBServices(): Promise<void> {
    let electionQueueManager: ElectionCommandQueue = new ElectionCommandQueue();
    let queryQueue: ElectionQueryQueue = new ElectionQueryQueue();

    let cacheCommand: CommandCache = new CommandCache();
    let cacheQuery: QueryCache = new QueryCache();

    let command: ElectionCommand = new ElectionCommand(electionQueueManager, cacheCommand);
    this.command = command;

    let query: ElectionQuery = new ElectionQuery();
    this.query = query;
  }
}
