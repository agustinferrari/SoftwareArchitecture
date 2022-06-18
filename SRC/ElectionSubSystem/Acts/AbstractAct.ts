import { Election } from "../../Common/Domain";
import { INotificationSender } from "../../Common/NotificationSender/INotificationSender";

export abstract class AbstractAct {
  async generateAndSendAct(
    election: Election,
    voterCount: number,
    emails: string[],
    sender: INotificationSender
  ): Promise<void> {
    let information = await this.getActInformation(election, voterCount);
    await sender.sendNotification(information, emails);
  }
  abstract  getActInformation(Election: Election, voterCount: number): Promise<string>;
}
