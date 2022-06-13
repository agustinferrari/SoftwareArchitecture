import { Election } from "../../Common/Domain";
import { INotificationSender } from "../../dist/Common/NotificationSender/INotificationSender";


export abstract class AbstractAct {
    generateAndSendAct(election: Election, voterCount : number, emails : string[],sender: INotificationSender): void {
        let information = this.getActInformation(election, voterCount);
        sender.sendNotification(information,emails);
    };
    abstract getActInformation(Election : Election, voterCount: number): string;
}