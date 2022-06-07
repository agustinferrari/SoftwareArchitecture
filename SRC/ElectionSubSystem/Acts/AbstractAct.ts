import { Election } from "../../Common/Domain";
import { INotificationSender } from "../../dist/Common/NotificationSender/INotificationSender";

export abstract class AbstractAct {
    generateAndSendAct(election: Election, sender: INotificationSender): void {
        let information = this.getActInformation(election);
        sender.sendNotification(information);
    };
    abstract getActInformation(Election : Election): string;
}