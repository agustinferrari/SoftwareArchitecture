import Axios, { AxiosInstance } from "axios";
import config from "config";
import { INotificationSender } from "./INotificationSender";

export class SMSNotificationSender implements INotificationSender {
  axios: AxiosInstance;
  endpoint: string;

  constructor() {
    this.endpoint = config.get("MessageSender.endpoint");
    this.axios = Axios.create({ baseURL: config.get("MessageSender.route") });
  }

  sendNotification(messageContent: string, destinations: string[]): void {
    let messageBody = { notification: messageContent };
    for (let i = 0; i< destinations.length ; i++) {
      console.log("SMS SENT to " + destinations[i] + JSON.stringify(messageBody));
    }
  }
}
