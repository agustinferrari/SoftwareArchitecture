import config from "config";
import {
    EmailNotificationSender,
  INotificationSender,
  SMSNotificationSender,
} from "../../../Common/NotificationSender";
export class NotificationHelper {
  static _instance: NotificationHelper;
  notificationSender: INotificationSender;

  constructor() {
    let configSender = config.get("NOTIFICATION_HELPER");
    switch (configSender) {
      case "EMAIL":
        this.notificationSender = new EmailNotificationSender();
        break;
      case "SMS":
        this.notificationSender = new SMSNotificationSender();
        break;
      default:
        this.notificationSender = new EmailNotificationSender();
    }
  }

  static getNotificationHelper(): NotificationHelper {
    if (!NotificationHelper._instance) {
      NotificationHelper._instance = new NotificationHelper();
    }
    return NotificationHelper._instance;
  }
}
