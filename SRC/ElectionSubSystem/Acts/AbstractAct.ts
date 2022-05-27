import { INotificationSender } from "../../dist/Common/NotificationSender/INotificationSender";
import { ElectionModel } from "../../dist/Common/Redis";

export abstract class AbstractAct {
    generateAndSendAct(election: ElectionModel, sender: INotificationSender): void {
        let information = this.getActInformation(election);
        sender.sendNotification(information);
    };
    abstract getActInformation(Election : ElectionModel): string;
}