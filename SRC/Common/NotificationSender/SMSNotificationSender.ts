import { INotificationSender } from "./INotificationSender";

export class SMSNotificationSender implements INotificationSender {


  constructor() {
  }

  sendNotification(messageContent: string, destinations: string[]): void {
    let messageBody = { notification: messageContent };
    for (let i = 0; i< destinations.length ; i++) {
      console.log("SMS SENT to " + destinations[i] + JSON.stringify(messageBody));
    }
  }
}
