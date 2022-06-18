import { INotificationSender } from "./INotificationSender";

export class SMSNotificationSender implements INotificationSender {


  constructor() {
  }

  async sendNotification(messageContent: string, destinations: string[]): Promise<void> {
    //TODO PASAR A QUE SI RECIBE UN STRING PARSEABLE A JSON SE IMPRIMA BIEN
    let messageBody = { notification: messageContent };
    for (let i = 0; i< destinations.length ; i++) {
      console.log("SMS SENT to " + destinations[i] + JSON.stringify(messageBody));
    }
    return;
  }
}
