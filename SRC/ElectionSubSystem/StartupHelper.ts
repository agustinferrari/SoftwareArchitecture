import {
  EmailNotificationSender,
  INotificationSender,
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
import { ElectionQueryQueue } from "./DataAccess/Query/ElectionQueryQueue";
import { QueryCache } from "../Common/Redis/QueryCache";
import { ElectionCommandQueue } from "./DataAccess/Command/ElectionCommandQueue";
import { QueryMongo } from "./DataAccess/Query/QueryMongo";
import { ElectionScheduler } from "./EventSchedulers/ElectionScheduler";

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

    let cacheCommand: CommandCache = new CommandCache();

    let command: ElectionCommand = new ElectionCommand(electionQueueManager, cacheCommand);
    this.command = command;

    let query: ElectionQuery = new ElectionQuery();
    this.query = query;
  }

  private async StateResynchronization(){
    let query: ElectionQuery = new ElectionQuery());
    let elections = await query.getElectionsInfo()
    let cacheCommand: CommandCache = new CommandCache();
    let today = new Date();
    let scheduler : ElectionScheduler;
    if(this.electionManager){
     scheduler = new ElectionScheduler(this.electionManager)
    }


    elections.forEach(async election=>{

      if(!query.existsElection(election.id)){
        cacheCommand.addElection(election);
        try{
          let settings = await QueryMongo.getSettings(election.id);
          cacheCommand.addNotificationSettings(settings);
        }
        catch(e){
        }
      }
      if(this.parseDate(election.startDate) > today){
        scheduler.scheduleStartElection(election, election.voterCount);

      }else if(this.parseDate(election.endDate) > today){

      }
    })

  }
  private parseDate(myDateStr: string): Date {
    const dateStr = myDateStr;
    const [dateComponents, timeComponents] = dateStr.split(" ");

    const [year, month, day] = dateComponents.split("-");
    const [hours, minutes, seconds] = timeComponents.split(":");

    const date = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
    return date;
  }
}
