import config from "config";
import {
    EmailNotificationSender,
  INotificationSender,
  SMSNotificationSender,
} from "../../../Common/NotificationSender";
export class NotificationHelper {
  static _instance: NotificationHelper;
  voteProofSender: INotificationSender;
  alertSender: INotificationSender;

  constructor() {
    let configSender = config.get("NOTIFICATION_HELPER");
    switch (configSender) {
      case "EMAIL":
        this.voteProofSender = new EmailNotificationSender();
        break;
      case "SMS":
        this.voteProofSender = new SMSNotificationSender();
        break;
      default:
        this.voteProofSender = new EmailNotificationSender();
    }
    this.alertSender = new EmailNotificationSender();
  }

  static getNotificationHelper(): NotificationHelper {
    if (!NotificationHelper._instance) {
      NotificationHelper._instance = new NotificationHelper();
    }
    return NotificationHelper._instance;
  }
  
}
