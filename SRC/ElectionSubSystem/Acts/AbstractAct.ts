import { ElectionDTO } from "../../Common/Domain";
import { INotificationSender } from "../../dist/Common/NotificationSender/INotificationSender";

export abstract class AbstractAct {
    generateAndSendAct(election: ElectionDTO, sender: INotificationSender): void {
        let information = this.getActInformation(election);
        sender.sendNotification(information);
    };
    abstract getActInformation(Election : ElectionDTO): string;
}