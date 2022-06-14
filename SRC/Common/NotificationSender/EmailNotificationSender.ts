import { INotificationSender } from "./INotificationSender";

export class EmailNotificationSender implements INotificationSender {


  constructor() {
  }

  sendNotification(messageContent: string, destinations: string[]): void {
    let messageBody = { notification: messageContent };

    destinations.forEach(destination => {
      console.log("Email SENT to " + destination + " "+ JSON.stringify(messageBody));
    });
  }
}
